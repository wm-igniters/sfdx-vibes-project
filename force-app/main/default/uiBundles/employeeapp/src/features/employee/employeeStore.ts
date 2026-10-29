/**
 * Tiny observable store for the employee handed over by the Employee
 * Directory. Components subscribe via `useEmployeeStore()`
 * (useSyncExternalStore), so every page re-renders when a new employee is
 * published — whether it arrived via the URL or via postMessage.
 *
 * State is mirrored to sessionStorage so a page refresh inside the app keeps
 * the employee and the "recently received" list.
 */
import { useSyncExternalStore } from 'react';
import { parseEmployeePayload, type EmployeePayload } from './employeeChannel';

const STORAGE_KEY = 'employeeapp.employeeStore.v1';
const MAX_HISTORY = 10;

export interface EmployeeState {
  current: EmployeePayload | null;
  history: EmployeePayload[];
}

const EMPTY: EmployeeState = { current: null, history: [] };

function load(): EmployeeState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as { current?: unknown; history?: unknown };
    const history = Array.isArray(parsed.history)
      ? parsed.history
          .map(parseEmployeePayload)
          .filter((e): e is EmployeePayload => e !== null)
          .slice(0, MAX_HISTORY)
      : [];
    return { current: parseEmployeePayload(parsed.current), history };
  } catch {
    return EMPTY;
  }
}

function persist(next: EmployeeState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep in memory only */
  }
}

let state: EmployeeState = typeof window === 'undefined' ? EMPTY : load();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

export function publishEmployee(employee: EmployeePayload) {
  const history = [
    employee,
    ...state.history.filter(e => e.employeeId !== employee.employeeId),
  ].slice(0, MAX_HISTORY);
  state = { current: employee, history };
  persist(state);
  emit();
}

export function selectEmployee(employeeId: string): EmployeePayload | null {
  const found = state.history.find(e => e.employeeId === employeeId) ?? null;
  if (found && state.current?.employeeId !== employeeId) {
    state = { ...state, current: found };
    persist(state);
    emit();
  }
  return found;
}

export function clearEmployees() {
  state = EMPTY;
  persist(state);
  emit();
}

export function getEmployeeState(): EmployeeState {
  return state;
}

export function subscribeEmployeeStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useEmployeeStore(): EmployeeState {
  return useSyncExternalStore(subscribeEmployeeStore, getEmployeeState, getEmployeeState);
}

/** Test helper — resets in-memory state. */
export function __resetEmployeeStoreForTests() {
  state = EMPTY;
  listeners.clear();
}
