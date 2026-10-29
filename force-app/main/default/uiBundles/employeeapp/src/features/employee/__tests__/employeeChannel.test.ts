import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  decodeEmployeePayload,
  encodeEmployeePayload,
  isTrustedOrigin,
  parseEmployeePayload,
  readEmployeeFromSearch,
  subscribeToEmployeeMessages,
  type EmployeePayload,
} from '../employeeChannel';
import {
  __resetEmployeeStoreForTests,
  getEmployeeState,
  publishEmployee,
  selectEmployee,
} from '../employeeStore';

const alice: EmployeePayload = {
  employeeId: 'EMP-001',
  employeeName: 'Alice Johnson',
  department: 'Engineering',
  title: 'Senior Engineer',
  email: 'alice.johnson@company.com',
  phone: '555-0101',
  salary: 95000,
  location: 'New York',
  hireDate: '2020-03-15',
  status: 'Active',
  avatarInitials: 'AJ',
  source: 'employeeDatatable',
  timestamp: 1730000000000,
};

describe('employeeChannel', () => {
  it('round-trips a payload through base64url (incl. non-ASCII)', () => {
    const p = { ...alice, employeeName: 'Zoë Ångström' };
    const encoded = encodeEmployeePayload(p);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeEmployeePayload(encoded)).toEqual(p);
  });

  it('matches the LWC encoder output', () => {
    // Same algorithm as lwc/employeeDatatable/employeeAppLink.js
    const json = JSON.stringify({ ...alice, employeeName: 'Zoë Ångström' });
    const binary = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_m, hex: string) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    const lwc = btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(decodeEmployeePayload(lwc)).toEqual({ ...alice, employeeName: 'Zoë Ångström' });
  });

  it('reads the employee from a search string', () => {
    const search = `?employee=${encodeEmployeePayload(alice)}&foo=bar`;
    expect(readEmployeeFromSearch(search)?.employeeId).toBe('EMP-001');
    expect(readEmployeeFromSearch('?foo=bar')).toBeNull();
  });

  it('rejects garbage and payloads without id/name', () => {
    expect(decodeEmployeePayload('not-base64!!')).toBeNull();
    expect(decodeEmployeePayload('x'.repeat(9000))).toBeNull();
    expect(parseEmployeePayload({ employeeName: 'No Id' })).toBeNull();
    expect(parseEmployeePayload([alice])).toBeNull();
  });

  it('drops unknown keys and coerces types', () => {
    const parsed = parseEmployeePayload({ id: 'E1', name: 'X Y', salary: '100', evil: '<script>' });
    expect(parsed).toEqual({ employeeId: 'E1', employeeName: 'X Y', salary: 100 });
  });

  it('only trusts Salesforce origins', () => {
    expect(isTrustedOrigin('https://acme.lightning.force.com')).toBe(true);
    expect(isTrustedOrigin('https://acme--c.develop.my.salesforce.app')).toBe(true);
    expect(isTrustedOrigin('https://evil.com')).toBe(false);
    expect(isTrustedOrigin('https://force.com.evil.com')).toBe(false);
    expect(isTrustedOrigin('http://acme.lightning.force.com')).toBe(false);
  });

  it('subscribes to postMessage hand-offs from trusted origins only', () => {
    const cb = vi.fn();
    const unsubscribe = subscribeToEmployeeMessages(cb);
    const post = (origin: string, data: unknown) =>
      window.dispatchEvent(new MessageEvent('message', { origin, data }));

    post('https://evil.com', { type: 'EMPLOYEE_SELECTED', payload: alice });
    post('https://acme.lightning.force.com', { type: 'OTHER', payload: alice });
    post('https://acme.lightning.force.com', { type: 'EMPLOYEE_SELECTED', payload: alice });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(alice);

    unsubscribe();
    post('https://acme.lightning.force.com', { type: 'EMPLOYEE_SELECTED', payload: alice });
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('employeeStore', () => {
  afterEach(() => {
    __resetEmployeeStoreForTests();
    sessionStorage.clear();
  });

  it('publishes, de-duplicates history and persists to sessionStorage', () => {
    const bob = { employeeId: 'EMP-002', employeeName: 'Bob Martinez' };
    publishEmployee(alice);
    publishEmployee(bob);
    publishEmployee(alice);
    const s = getEmployeeState();
    expect(s.current?.employeeId).toBe('EMP-001');
    expect(s.history.map(e => e.employeeId)).toEqual(['EMP-001', 'EMP-002']);
    expect(sessionStorage.getItem('employeeapp.employeeStore.v1')).toContain('EMP-002');
  });

  it('selects an employee from history', () => {
    publishEmployee(alice);
    publishEmployee({ employeeId: 'EMP-002', employeeName: 'Bob Martinez' });
    expect(selectEmployee('EMP-001')?.employeeName).toBe('Alice Johnson');
    expect(getEmployeeState().current?.employeeId).toBe('EMP-001');
    expect(selectEmployee('missing')).toBeNull();
  });
});
