import { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useGoals, filterGoalsForUser } from '../../hooks/useGoals';
import AppShell from '../layout/AppShell';
import Sidebar from '../layout/Sidebar';
import FilterBar from '../common/FilterBar';
import StatsCards from '../stats/StatsCards';
import GoalPanel from '../goals/GoalPanel';
import GoalForm from '../goals/GoalForm';
import StaffManagement from '../staff/StaffManagement';

const tabBtn =
  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2';

export default function AdminDashboard() {
  const { state } = useAppContext();
  const { currentUser } = useAuth();
  const scoped = useMemo(
    () => filterGoalsForUser(state.goals, currentUser),
    [state.goals, currentUser]
  );
  const { goals, filter, sort, setFilter, setSort, selectGoal, selectedGoalId, addGoal } =
    useGoals(scoped);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    if (selectedGoalId && !goals.some((g) => g.id === selectedGoalId)) {
      selectGoal(null);
    }
  }, [goals, selectedGoalId, selectGoal]);

  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedGoalId) || null,
    [goals, selectedGoalId]
  );

  return (
    <>
      <AppShell
        stats={<StatsCards goals={goals} actions={state.actions} tasks={state.tasks} />}
        sidebar={
          <Sidebar goals={goals} selectedGoalId={selectedGoalId} onSelectGoal={selectGoal} />
        }
      >
        <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-5 shadow-sm">

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className={`${tabBtn} ${currentView === 'dashboard'
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-indigo-200/50'
                  : 'border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] hover:border-[var(--color-border-active)]'
                }`}
            >
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('staff')}
              className={`${tabBtn} ${currentView === 'staff'
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-indigo-200/50'
                  : 'border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] hover:border-[var(--color-border-active)]'
                }`}
            >
              <Users className="h-4 w-4 shrink-0" aria-hidden />
              Staff
            </button>
          </div>
        </div>

        {currentView === 'dashboard' ? (
          <>
            <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4 items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Users className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">Workspace</h2>

                   
                  </div>
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

            <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-4 shadow-sm">
              <FilterBar filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort} />
            </div>

            <GoalPanel goal={selectedGoal} />
          </>
        ) : (
          <StaffManagement />
        )}
      </AppShell>

      <GoalForm
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSave={(payload) => addGoal(payload)}
      />
    </>
  );
}
