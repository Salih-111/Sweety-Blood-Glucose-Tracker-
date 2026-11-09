import type { ReactNode } from "react";
import {
  Activity,
  Check,
  ClipboardCheck,
  Droplet,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

type AuthLayoutProps = {
  children: ReactNode;
  variant: "login" | "register";
};

function AuthLayout({ children, variant }: AuthLayoutProps) {
  const isLogin = variant === "login";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4 py-6 dark:bg-[#0B0F14] sm:px-6 lg:py-10">

      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-xl shadow-brand-900/10 dark:border-slate-700 dark:bg-[#151B23] dark:shadow-black/30 lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT BRANDING PANEL */}
        <section className="relative flex min-h-90 flex-col justify-between overflow-hidden bg-linear-to-br from-[#F0FDFA] to-[#DDF8F1] p-7 dark:from-[#102725] dark:to-[#15332F] sm:p-10 lg:min-h-155 lg:p-12">

          {/* Decorative background */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-100/70 dark:bg-brand-700/10" />

          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/60 dark:bg-brand-700/10" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
              <Droplet size={29} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                GlucoTrack
              </h1>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Blood Glucose Tracker
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="relative z-10 mt-10 max-w-md lg:mt-0">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-400">
              <HeartPulse size={27} />
            </div>

            <h2 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
              {isLogin ? (
                <>
                  Track Your Glucose,
                  <br />
                  Stay{" "}
                  <span className="text-brand-700 dark:text-brand-400">
                    Healthier
                  </span>
                </>
              ) : (
                <>
                  Start Your
                  <br />
                  Health Journey
                  <br />
                  <span className="text-brand-700 dark:text-brand-400">
                    Today
                  </span>
                </>
              )}
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
              {isLogin
                ? "Record your readings, view trends, and stay in control of your health."
                : "Create your account and keep track of your glucose levels easily."}
            </p>
          </div>

          {/* Illustration */}
          <div className="relative z-10 flex min-h-48 items-center justify-center py-6 lg:min-h-56">

            {isLogin ? (
              /* Glucose meter illustration */
              <div className="relative flex items-center justify-center">

                <div className="absolute h-48 w-48 rounded-full bg-brand-200/50 blur-2xl dark:bg-brand-500/10" />

                <div className="relative z-10 flex h-48 w-36 rotate-3 flex-col items-center rounded-[30px] border-4 border-brand-700 bg-linear-to-b from-brand-500 to-brand-700 p-3 shadow-xl dark:border-brand-400">

                  <div className="mb-3 h-2 w-8 rounded-full bg-white/50" />

                  <div className="flex w-full flex-1 flex-col items-center justify-center rounded-2xl border-2 border-brand-200 bg-[#E9FFF7] text-brand-900 shadow-inner">
                    <span className="text-4xl font-extrabold">
                      112
                    </span>

                    <span className="text-sm font-semibold">
                      mg/dL
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <Droplet size={18} className="text-white" />
                    <div className="h-2 w-8 rounded-full bg-white/60" />
                  </div>
                </div>

                <div className="absolute -right-20 bottom-0 flex h-20 w-24 items-center justify-center rounded-2xl border border-brand-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                  <Activity size={48} className="text-brand-600 dark:text-brand-400" />
                </div>

              </div>
            ) : (
              /* Registration checklist illustration */
              <div className="relative flex items-center justify-center">

                <div className="absolute h-48 w-48 rounded-full bg-brand-200/50 blur-2xl dark:bg-brand-500/10" />

                <div className="relative z-10 flex h-48 w-36 rotate-3 flex-col rounded-2xl border-4 border-brand-700 bg-white p-4 shadow-xl dark:border-brand-500 dark:bg-slate-800">

                  <div className="mx-auto mb-4 h-3 w-10 rounded-full bg-brand-600" />

                  {[1, 2, 3].map((item) => (
                    <div key={item} className="mb-4 flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                        <Check size={16} />
                      </div>

                      <div className="h-2 w-16 rounded-full bg-slate-200 dark:bg-slate-600" />
                    </div>
                  ))}

                  <div className="mt-auto flex justify-center">
                    <ClipboardCheck
                      size={27}
                      className="text-brand-600 dark:text-brand-400"
                    />
                  </div>
                </div>

                <div className="absolute -right-16 bottom-0 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800">
                  <Droplet size={29} className="text-brand-600 dark:text-brand-400" />
                </div>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck size={16} />
            {isLogin
              ? "Your health deserves care and attention."
              : "Start tracking your health journey today."}
          </div>

        </section>

        {/* RIGHT FORM PANEL */}
        <section className="relative flex items-center justify-center bg-white px-6 py-12 dark:bg-[#151B23] sm:px-12 lg:px-14">

          <div className="absolute right-5 top-5">
            <ThemeToggle />
          </div>

          <div className="w-full max-w-md pt-8">

            {/* Mobile branding */}
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <Droplet size={27} className="text-brand-600 dark:text-brand-400" />

              <span className="text-xl font-bold text-slate-900 dark:text-white">
                GlucoTrack
              </span>
            </div>

            {children}

          </div>

        </section>

      </div>

    </main>
  );
}

export default AuthLayout;