import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calcGoalProgress } from '../../utils/progressCalculator';
import { format, parseISO } from 'date-fns';
import { ChevronRight, Calendar } from 'lucide-react';

function formatDeadline(deadline) {
  if (!deadline) return 'No date';
  try {
    return format(parseISO(deadline), 'MMM dd');
  } catch {
    return deadline;
  }
}

export default function GoalItem({ goal, active, onSelect }) {
  const { state } = useAppContext();
  const progress = useMemo(
    () => calcGoalProgress(goal, state.actions, state.tasks),
    [goal, state.actions, state.tasks]
  );
  const actionCount = useMemo(
    () => state.actions.filter((a) => a.goalId === goal.id).length,
    [goal.id, state.actions]
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(goal.id)}
      className={`group relative w-full cursor-pointer rounded-xl border p-3.5 text-left transition-all duration-200 mb-2 ${
        active
          ? 'border-[var(--color-primary)] bg-indigo-50/50 shadow-sm'
          : 'border-transparent hover:bg-white hover:shadow-md hover:border-[var(--color-border)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className={`truncate font-bold text-sm transition-colors ${
            active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
          }`}>
            {goal.name}
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-text-muted)]">
              <Calendar className="h-3 w-3" />
              {formatDeadline(goal.deadline)}
            </div>
            <div className="h-1 w-1 rounded-full bg-[var(--color-border)]"></div>
            <div className="text-[11px] font-bold text-[var(--color-text-muted)]">
              {actionCount} Actions
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[11px] font-bold ${
            progress === 100 ? 'text-emerald-600' : 'text-[var(--color-primary)]'
          }`}>
            {progress}%
          </span>
          <div className="h-1.5 w-12 rounded-full bg-slate-200 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                progress === 100 ? 'bg-emerald-500' : 'bg-[var(--color-primary)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
          active ? 'text-[var(--color-primary)] translate-x-0.5' : 'text-[var(--color-text-light)] opacity-0 group-hover:opacity-100'
        }`} />
      </div>
      
      {active && (
        <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-[var(--color-primary)]" />
      )}
    </button>
  );
}

