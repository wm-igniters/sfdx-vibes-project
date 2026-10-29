/**
 * Wires the employee channel into the router:
 *  - On any location with `?employee=...`, decode it, publish it to the store
 *    and redirect to `/employees/:employeeId` (query param stripped so the
 *    payload doesn't linger in history / bookmarks).
 *  - While mounted, subscribe to postMessage hand-offs and navigate to the
 *    newly selected employee.
 *
 * Mount once, in the app layout.
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  EMPLOYEE_QUERY_PARAM,
  readEmployeeFromSearch,
  subscribeToEmployeeMessages,
} from './employeeChannel';
import { publishEmployee } from './employeeStore';

export function employeePath(employeeId: string) {
  return `/employees/${encodeURIComponent(employeeId)}`;
}

export function useEmployeeSubscription() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. URL hand-off (redirect from the Employee Directory)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.has(EMPLOYEE_QUERY_PARAM)) return;

    const employee = readEmployeeFromSearch(location.search);
    params.delete(EMPLOYEE_QUERY_PARAM);
    const rest = params.toString();

    if (employee) {
      publishEmployee(employee);
      navigate(
        { pathname: employeePath(employee.employeeId), search: rest ? `?${rest}` : '' },
        { replace: true }
      );
    } else {
      // Invalid payload — drop it and stay where we are.
      navigate({ pathname: location.pathname, search: rest ? `?${rest}` : '' }, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  // 2. Live postMessage hand-off (app embedded in a Lightning page)
  useEffect(
    () =>
      subscribeToEmployeeMessages(employee => {
        publishEmployee(employee);
        navigate(employeePath(employee.employeeId));
      }),
    [navigate]
  );
}
