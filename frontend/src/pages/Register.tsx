import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react"

import AuthLayout from "../components/AuthLayout"
import apiRequest from "../services/api"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setMessage("")
    setError("")

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setIsSubmitting(true)
      await apiRequest<{
        message: string
        user: {
          id: number
          name: string
          email: string
        }
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      })

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please log in.",
        },
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <AuthLayout variant="register">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-brand-600 dark:text-brand-400">
          GET STARTED
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-(--text-primary)">
          Create an account
        </h2>

        <p className="mt-2 text-sm text-(--text-secondary)">
          Join GlucoTrack and take control of your health.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-(--text-primary)"
          >
            Full name
          </label>

          <div className="relative">
            <UserRound
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary)"
            />

            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-11 pr-4 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="register-email"
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
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-11 pr-4 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="register-password"
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
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
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

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-(--text-primary)"
          >
            Confirm password
          </label>

          <div className="relative">
            <LockKeyhole
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary)"
            />

            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-11 pr-12 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-secondary) hover:text-brand-600"
            >
              {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="text-sm text-brand-600 dark:text-brand-400"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-(--text-secondary)">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-brand-700 hover:underline dark:text-brand-400"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register
