import { Pencil, Trash2, UserCheck, UserX } from 'lucide-react';

const roleBadge = (role) => {
  const map = {
    admin: 'border-violet-300/60 bg-violet-50 text-violet-900',
    manager: 'border-sky-300/60 bg-sky-50 text-sky-900',
    staff: 'border-teal-300/60 bg-teal-50 text-teal-900',
    user: 'border-slate-300/60 bg-slate-50 text-slate-800',
  };
  return map[role] || 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]';
};

const roleLabel = (role) =>
  ({ admin: 'Admin', manager: 'Manager', staff: 'Staff', user: 'User' }[role] ||
  role);

const iconBtn =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-active)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25';

export default function StaffList({ staff, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/80">
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Name
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Email
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Phone
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Role
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Status
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {staff.map((member) => (
            <tr
              key={member.id ?? member._id}
              className={`transition-colors ${
                member.isActive
                  ? 'hover:bg-[var(--color-primary-light)]/40'
                  : 'bg-[var(--color-bg)]/50 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]'
              }`}
            >
              <td className="px-4 py-3.5">
                <span className="font-semibold text-[var(--color-text)]">{member.name}</span>
              </td>
              <td className="max-w-[200px] truncate px-4 py-3.5 text-[var(--color-text)]">{member.email}</td>
              <td className="whitespace-nowrap px-4 py-3.5 text-[var(--color-text-muted)]">
                {member.phone || '—'}
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleBadge(member.role)}`}
                >
                  {roleLabel(member.role)}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    member.isActive
                      ? 'border-emerald-300/50 bg-emerald-50 text-emerald-900'
                      : 'border-amber-300/50 bg-amber-50 text-amber-900'
                  }`}
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(member)}
                    title="Edit"
                    className={iconBtn}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(member)}
                    title={member.isActive ? 'Deactivate' : 'Activate'}
                    className={iconBtn}
                  >
                    {member.isActive ? (
                      <UserX className="h-4 w-4" aria-hidden />
                    ) : (
                      <UserCheck className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(member)}
                    title="Remove"
                    className={`${iconBtn} border-[var(--color-danger)]/25 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
