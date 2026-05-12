import { useMemo } from 'react';
import { Target, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { calcGoalProgress } from '../../utils/progressCalculator';
import { getDeadlineStatus } from '../../utils/deadlineUtils';
import { DEADLINE_STATUS } from '../../constants';

function TopCard({ value, label, icon: Icon, colorClass }) {
  return (
    <div className="flex-1 min-w-[160px] rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-border)] transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <span className="block text-2xl font-bold text-[var(--color-text)] tracking-tight">
            {value}
          </span>
          <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function StatsCards({ goals, actions, tasks }) {
  const metrics = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter((g) => calcGoalProgress(g, actions, tasks) === 100).length;
    const inProgress = goals.filter((g) => {
      const p = calcGoalProgress(g, actions, tasks);
      return p > 0 && p < 100;
    }).length;
    const overdue = goals.filter((g) => {
      const p = calcGoalProgress(g, actions, tasks);
      return getDeadlineStatus(g.deadline) === DEADLINE_STATUS.OVERDUE && p < 100;
    }).length;

    return { total, inProgress, completed, overdue };
  }, [goals, actions, tasks]);

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <TopCard 
        value={metrics.total} 
        label="Total" 
        icon={Target} 
        colorClass="bg-indigo-50 text-[var(--color-primary)]" 
      />
      <TopCard 
        value={metrics.inProgress} 
        label="Active" 
        icon={Zap} 
        colorClass="bg-amber-50 text-amber-600" 
      />
      <TopCard 
        value={metrics.completed} 
        label="Completed" 
        icon={CheckCircle2} 
        colorClass="bg-emerald-50 text-emerald-600" 
      />
      <TopCard 
        value={metrics.overdue} 
        label="Overdue" 
        icon={AlertCircle} 
        colorClass="bg-rose-50 text-rose-600" 
      />
    </div>
  );
}

