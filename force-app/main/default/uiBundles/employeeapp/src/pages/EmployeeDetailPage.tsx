import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import {
  BadgeDollarSign,
  Briefcase,
  Building2,
  CalendarDays,
  Inbox,
  Mail,
  MapPin,
  Phone,
  Radio,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import {
  employeePath,
  selectEmployee,
  useEmployeeStore,
  type EmployeePayload,
} from '../features/employee';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatDate(value?: string) {
  if (!value) return undefined;
  // Apex sends ISO yyyy-mm-dd; parse as a local date to avoid TZ day-shift.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

function initials(e: EmployeePayload) {
  if (e.avatarInitials) return e.avatarInitials.slice(0, 2).toUpperCase();
  const parts = e.employeeName.split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
        <dd className="break-words text-sm text-gray-900">{children ?? '—'}</dd>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-12 text-center">
        <Inbox className="mb-4 size-10 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">No employee selected yet</h2>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Open the <strong>Employee Directory</strong> in Salesforce and click an employee name.
          You'll be redirected here and the employee's details will be shown.
        </p>
      </CardContent>
    </Card>
  );
}

function EmployeeCard({ employee }: { employee: EmployeePayload }) {
  const active = employee.status === 'Active';
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-14">
            <AvatarFallback className="bg-blue-100 text-lg font-semibold text-blue-700">
              {initials(employee)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-xl font-semibold">
              <h1>{employee.employeeName}</h1>
            </CardTitle>
            <CardDescription>
              {[employee.title, employee.department].filter(Boolean).join(' · ') || '—'}
            </CardDescription>
          </div>
          {employee.status && (
            <Badge
              className="ml-auto"
              variant={active ? 'default' : 'destructive'}
              aria-label={`Status: ${employee.status}`}
            >
              {employee.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <DetailRow icon={Briefcase} label="Employee ID">
            {employee.employeeId}
          </DetailRow>
          <DetailRow icon={Building2} label="Department">
            {employee.department}
          </DetailRow>
          <DetailRow icon={Mail} label="Email">
            {employee.email && (
              <a className="text-blue-700 hover:underline" href={`mailto:${employee.email}`}>
                {employee.email}
              </a>
            )}
          </DetailRow>
          <DetailRow icon={Phone} label="Phone">
            {employee.phone && (
              <a className="text-blue-700 hover:underline" href={`tel:${employee.phone}`}>
                {employee.phone}
              </a>
            )}
          </DetailRow>
          <DetailRow icon={MapPin} label="Location">
            {employee.location}
          </DetailRow>
          <DetailRow icon={CalendarDays} label="Hire date">
            {formatDate(employee.hireDate)}
          </DetailRow>
          <DetailRow icon={BadgeDollarSign} label="Salary">
            {employee.salary !== undefined ? currency.format(employee.salary) : undefined}
          </DetailRow>
        </dl>
        <Separator className="my-3" />
        <p className="flex items-center gap-2 text-xs text-gray-500">
          <Radio className="size-3.5" aria-hidden="true" />
          Received from {employee.source ?? 'Salesforce'}
          {employee.timestamp
            ? ` at ${new Date(employee.timestamp).toLocaleString()}`
            : ''}
        </p>
      </CardContent>
    </Card>
  );
}

function RecentEmployees({
  history,
  activeId,
}: {
  history: EmployeePayload[];
  activeId?: string;
}) {
  if (history.length === 0) return null;
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Recently received</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1">
          {history.map(e => (
            <li key={e.employeeId}>
              <Link
                to={employeePath(e.employeeId)}
                aria-current={e.employeeId === activeId ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                  e.employeeId === activeId
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Avatar size="sm">
                  <AvatarFallback className="text-[10px]">{initials(e)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{e.employeeName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function EmployeeDetailPage() {
  const { employeeId } = useParams();
  const { current, history } = useEmployeeStore();

  const employee = employeeId
    ? current?.employeeId === employeeId
      ? current
      : (history.find(e => e.employeeId === employeeId) ?? null)
    : current;

  useEffect(() => {
    if (employeeId) selectEmployee(employeeId);
  }, [employeeId]);

  useEffect(() => {
    document.title = employee ? `${employee.employeeName} | Employee App` : 'Employee | Employee App';
  }, [employee]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 outline-none sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          {employee ? (
            <EmployeeCard employee={employee} />
          ) : employeeId ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-gray-600">
                <h1 className="mb-2 text-lg font-semibold text-gray-900">Employee not available</h1>
                No data was received for <strong>{employeeId}</strong> in this session. Click the
                employee's name in the Employee Directory to send it again.
              </CardContent>
            </Card>
          ) : (
            <EmptyState />
          )}
        </div>
        <aside aria-label="Recently received employees">
          <RecentEmployees history={history} activeId={employee?.employeeId} />
        </aside>
      </div>
    </main>
  );
}
