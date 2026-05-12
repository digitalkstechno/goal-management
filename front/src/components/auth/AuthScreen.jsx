import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const INITIAL_LOGIN = { email: '', password: '' };
const INITIAL_REGISTER = { name: '', email: '', password: '' };

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN);
  const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(loginForm);
      toast.success('Login successful');
    } catch (error) {
      toast.error(error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(registerForm);
      toast.success('Registration successful');
    } catch (error) {
      toast.error(error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-card">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Goal Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {isRegisterMode ? 'Create your account' : 'Sign in to continue'}
        </p>

        {!isRegisterMode ? (
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <input
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
            <input
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
            <button
              className="w-full rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <input
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              type="text"
              placeholder="Full name"
              value={registerForm.name}
              onChange={(event) =>
                setRegisterForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
            <input
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
              }
              minLength={6}
              required
            />
            <button
              className="w-full rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <button
          type="button"
          className="mt-4 text-sm font-medium text-[var(--color-primary)]"
          onClick={() => setIsRegisterMode((prev) => !prev)}
        >
          {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}
