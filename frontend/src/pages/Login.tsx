import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import AuthLayout from "../components/AuthLayout";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Temporary: API integration will be added next.
    setMessage("Login form is ready. Authentication integration is next.");
  };

  return (
    <AuthLayout variant="login">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
          WELCOME BACK
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-(--text-primary)">
          Welcome back!
        </h2>

        <p className="mt-2 text-sm text-(--text-secondary)">
          Login to your GlucoTrack account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-(--text-primary)"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary)"
            />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage("");
              }}
              required
              className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-11 pr-4 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-(--text-primary)"
          >
            Password
          </label>

          <div className="relative">
            <LockKeyhole
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary)"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setMessage("");
              }}
              required
              className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-11 pr-12 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary) hover:text-brand-600"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          Login
          <ArrowRight size={18} />
        </button>

        {message && (
          <p role="status" className="text-center text-xs text-brand-600 dark:text-brand-400">
            {message}
          </p>
        )}
      </form>

      {/* Register link */}
      <p className="mt-8 text-center text-sm text-(--text-secondary)">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-brand-700 hover:underline dark:text-brand-400"
        >
          Create account
        </Link>
      </p>

      <p className="mt-10 text-center text-xs text-(--text-secondary)">
        Your health journey, one reading at a time.
      </p>
    </AuthLayout>
  );
}

export default Login;