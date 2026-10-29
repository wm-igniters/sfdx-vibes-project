# React Internal App

An internal React template for the Salesforce platform. Includes an Agentforce conversation client and global search; intended for internal (non-Experience Cloud) deployment. Built with React, Vite, TypeScript, and Tailwind/shadcn.

For project-level details (metadata, deploy), see the [project README](../../../../../../README.md).

## Prerequisites

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Starts the Vite dev server (default: http://localhost:5173).

## Build

```bash
npm run build
```

Writes the production bundle to `dist/` inside the UI Bundle folder.

## Test

```bash
npm test
```

Runs the unit test suite (Vitest).

## Employee Directory hand-off

Clicking an **Employee Name** in the `employeeDatatable` LWC (Employee Directory) redirects to this app with the selected row:

```
https://<mydomain>--c.<instance>.my.salesforce.app/app/c__employeeapp?employee=<base64url(JSON)>
```

- `src/features/employee/employeeChannel.ts` – payload contract, base64url decode, validation, `postMessage` subscription (Salesforce origins only).
- `src/features/employee/employeeStore.ts` – observable store (`useEmployeeStore`), persisted to `sessionStorage` (current + recently received).
- `src/features/employee/useEmployeeSubscription.ts` – mounted in `appLayout.tsx`; consumes `?employee=`, publishes it, and redirects to `/employees/:employeeId`.
- `src/pages/EmployeeDetailPage.tsx` – renders the subscribed employee.

The LWC derives the app URL from the Lightning host; override it with the **Employee App URL** property in Lightning App Builder if your org's UI Bundle URL differs. Tick **Open Employee App in new tab** to keep the directory open.
