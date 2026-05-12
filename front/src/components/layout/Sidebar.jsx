import { useMemo, useState } from 'react';
import { Search, FolderOpen, Layers } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { calcGoalProgress } from '../../utils/progressCalculator';
import { getDeadlineStatus } from '../../utils/deadlineUtils';
import { DEADLINE_STATUS } from '../../constants';
import GoalList from '../goals/GoalList';

const TABS = [
  { id: 'all', label: 'All Goals' },
  { id: 'active', label: 'Active' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Done' },
];

function matchesTab(goal, tab, actions, tasks) {
  const progress = calcGoalProgress(goal, actions, tasks);
  const overdue = getDeadlineStatus(goal.deadline) === DEADLINE_STATUS.OVERDUE && progress < 100;
  switch (tab) {
    case 'active':
      return (
        (goal.status === 'in_progress' ||
          goal.status === 'not_started' ||
          goal.status === 'on_hold') &&
        progress < 100
      );
    case 'overdue':
      return overdue;
    case 'completed':
      return progress === 100;
    default:
      return true;
  }
}

export default function Sidebar({ goals, selectedGoalId, onSelectGoal }) {
  const { state } = useAppContext();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');

  const visible = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return goals
      .filter((g) => matchesTab(g, tab, state.actions, state.tasks))
      .filter((g) => !qq || g.name.toLowerCase().includes(qq));
  }, [goals, q, tab, state.actions, state.tasks]);

  return (
    <div className="flex h-full min-h-0 flex-col min-[900px]:max-h-[calc(100vh-10rem)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-[var(--color-primary)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
            Workspace
          </h3>
        </div>
        <span className="rounded-lg bg-[var(--color-primary-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
          {goals.length} Goals
        </span>
      </div>

      <div className="relative group mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-light)] transition-colors group-focus-within:text-[var(--color-primary)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Quick search..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm transition-all focus:border-[var(--color-primary)] focus:ring-4 focus:ring-indigo-50 outline-none"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5 border-b border-[var(--color-border)] pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative px-3 py-1.5 text-xs font-bold transition-all ${
              tab === t.id
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-[-9px] left-0 h-0.5 w-full bg-[var(--color-primary)]" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        {visible.length > 0 ? (
          <GoalList goals={visible} selectedGoalId={selectedGoalId} onSelect={onSelectGoal} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-10 w-10 text-[var(--color-text-light)] opacity-20 mb-3" />
            <p className="text-sm text-[var(--color-text-muted)]">No goals found</p>
          </div>
        )}
      </div>
    </div>
  );
}

