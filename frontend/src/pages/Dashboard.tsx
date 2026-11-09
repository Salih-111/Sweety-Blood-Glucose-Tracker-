import {
  Activity,
  TrendingUp,
  TrendingDown,
  Hash,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import useAuth from "../context/useAuth";

const summaryCards = [
  {
    title: "Average glucose",
    icon: Activity,
    description: "Average reading",
  },
  {
    title: "Highest reading",
    icon: TrendingUp,
    description: "Maximum glucose level",
  },
  {
    title: "Lowest reading",
    icon: TrendingDown,
    description: "Minimum glucose level",
  },
  {
    title: "Total readings",
    icon: Hash,
    description: "Recorded readings",
  },
];

function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Overview */}
      <section id="overview">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-brand-600 dark:text-brand-400">
            OVERVIEW
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary) sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>

          <p className="mt-2 text-sm text-(--text-secondary)">
            Here's an overview of your glucose readings and health trends.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-(--app-border) bg-(--surface) p-5 transition hover:border-brand-500/40"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-(--text-secondary)">
                    {card.title}
                  </p>

                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <Icon size={20} />
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-bold text-(--text-primary)">
                  —
                </h2>

                <p className="mt-2 text-xs text-(--text-secondary)">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent readings */}
      <section id="readings" className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-(--text-primary)">
              Recent readings
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Your latest recorded glucose measurements.
            </p>
          </div>

          <ClipboardList
            size={22}
            className="text-brand-600 dark:text-brand-400"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-(--app-border) bg-(--surface)">
          <div className="grid grid-cols-3 gap-3 border-b border-(--app-border) px-5 py-4 text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">
            <span>Date</span>
            <span>Time slot</span>
            <span className="text-right">Glucose</span>
          </div>

          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <Activity size={27} />
            </div>

            <h3 className="text-sm font-semibold text-(--text-primary)">
              No readings to display yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-(--text-secondary)">
              Your glucose readings will appear here once you start recording
              them.
            </p>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section id="reports" className="mt-10">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-(--text-primary)">
            Reports & insights
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Review your glucose statistics across different periods.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Daily report",
              description: "Review readings for a selected day.",
            },
            {
              title: "Month to date",
              description: "Your progress from the beginning of this month.",
            },
            {
              title: "Previous month",
              description: "Review your previous month's statistics.",
            },
          ].map((report) => (
            <div
              key={report.title}
              className="rounded-2xl border border-(--app-border) bg-(--surface) p-5"
            >
              <CalendarDays
                size={22}
                className="text-brand-600 dark:text-brand-400"
              />

              <h3 className="mt-4 font-semibold text-(--text-primary)">
                {report.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                {report.description}
              </p>

              <p className="mt-5 text-xs font-medium text-(--text-secondary)">
                Statistics will appear here.
              </p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;