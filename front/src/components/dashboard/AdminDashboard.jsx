import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useGoals } from '../../hooks/useGoals';
import AppShell from '../layout/AppShell';
import Sidebar from '../layout/Sidebar';
import FilterBar from '../common/FilterBar';
import StatsCards from '../stats/StatsCards';
import GoalPanel from '../goals/GoalPanel';
import GoalForm from '../goals/GoalForm';

export default function AdminDashboard() {
  const { state } = useAppContext();
  const { goals, filter, sort, setFilter, setSort, selectGoal, selectedGoalId, addGoal } =
    useGoals();
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  useEffect(() => {
    if (selectedGoalId && !goals.some((g) => g.id === selectedGoalId)) {
      selectGoal(null);
    }
  }, [goals, selectedGoalId, selectGoal]);

  const selectedGoal = useMemo(
    () => state.goals.find((g) => g.id === selectedGoalId) || null,
    [state.goals, selectedGoalId]
  );

  return (
    <>
      <AppShell
        stats={<StatsCards goals={state.goals} actions={state.actions} tasks={state.tasks} />}
        sidebar={
          <Sidebar goals={goals} selectedGoalId={selectedGoalId} onSelectGoal={selectGoal} />
        }
      >
        <div className="mb-5 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Workspace</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Create and manage goals from the workspace panel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGoalModalOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              Create Goal
            </button>
          </div>
        </div>
        <FilterBar filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort} />
        <GoalPanel goal={selectedGoal} />
      </AppShell>
      <GoalForm
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSave={(payload) => addGoal(payload)}
      />
    </>
  );
}
