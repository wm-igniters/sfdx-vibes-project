import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router';
import EmployeeDetailPage from '../../../pages/EmployeeDetailPage';
import { encodeEmployeePayload, useEmployeeSubscription, __resetEmployeeStoreForTests } from '..';

function Layout() {
  useEmployeeSubscription();
  return <Outlet />;
}

function renderAt(url: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <p>home</p> },
          { path: 'employees', element: <EmployeeDetailPage /> },
          { path: 'employees/:employeeId', element: <EmployeeDetailPage /> },
        ],
      },
    ],
    { initialEntries: [url] }
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('EmployeeDetailPage (redirect hand-off)', () => {
  afterEach(() => {
    __resetEmployeeStoreForTests();
    sessionStorage.clear();
  });

  it('renders the employee passed on the URL and redirects to /employees/:id', async () => {
    const payload = encodeEmployeePayload({
      employeeId: 'EMP-004',
      employeeName: 'David Chen',
      department: 'Engineering',
      title: 'Principal Engineer',
      salary: 130000,
      hireDate: '2017-11-05',
      status: 'Active',
    });
    const router = renderAt(`/?employee=${payload}`);

    expect(await screen.findByRole('heading', { name: 'David Chen' })).toBeInTheDocument();
    expect(screen.getByText('$130,000')).toBeInTheDocument();
    expect(screen.getByText('Nov 05, 2017')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/employees/EMP-004');
    expect(router.state.location.search).toBe('');
  });

  it('shows an empty state when nothing has been received', async () => {
    renderAt('/employees');
    expect(await screen.findByText('No employee selected yet')).toBeInTheDocument();
  });
});
