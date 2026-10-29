import type { RouteObject } from 'react-router';
import AppLayout from './appLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { Search as GlobalSearch, config } from "./features/search";
import AccountObjectDetail from "./pages/AccountObjectDetailPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        handle: { showInNavigation: true, label: "Home" }
      },
      {
        path: "search",
        element: (
					<GlobalSearch
						config={config}
						title="Search"
						searchPlaceholder="Search accounts, contacts, opportunities, and content..."
					/>
				),
        handle: { showInNavigation: true, label: "Search" }
      },
      {
        path: "employees",
        element: <EmployeeDetailPage />,
        handle: { showInNavigation: true, label: "Employee" }
      },
      {
        path: "employees/:employeeId",
        element: <EmployeeDetailPage />
      },
      {
        path: "accounts/:recordId",
        element: <AccountObjectDetail />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];
