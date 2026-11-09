import { useCallback, useEffect, useState } from "react";
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
import AddReadingForm from "../components/AddReadingForm";

import {
  getReadings,
  getMonthToDateReport,
} from "../services/glucoseService";

import type {
  GlucoseReading,
  ReportSummary,
  TimeSlot,
} from "../types/glucose";

// Get today's date in the browser's local timezone.
function getLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert API time-slot values into readable labels.
const timeSlotLabels: Record<TimeSlot, string> = {
  morning_fasting: "Morning fasting",
  after_breakfast: "After breakfast",
  after_lunch: "After lunch",
  after_dinner: "After dinner",
};

// Format reading date for display.
function formatReadingDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Fetch the data without changing React state. This helper is shared by
// the initial page load and the refresh after a reading is added.
async function fetchDashboardData() {
  const today = getLocalDate();

  const [readingsData, reportData] = await Promise.all([
    getReadings(),
    getMonthToDateReport(today),
  ]);

  return {
    readings: readingsData.readings,
    summary: reportData.summary,
  };
}

function Dashboard() {
  const { user } = useAuth();

  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Refresh the dashboard after a reading is added.
  const loadDashboard = useCallback(async () => {
    try {
      const data = await fetchDashboardData();

      setError("");
      setReadings(data.readings);
      setSummary(data.summary);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data when the dashboard first mounts.
  useEffect(() => {
    let isActive = true;

    const loadInitialDashboard = async () => {
      try {
        const data = await fetchDashboardData();

        if (!isActive) return;

        setError("");
        setReadings(data.readings);
        setSummary(data.summary);
      } catch (error) {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const recentReadings = readings.slice(0, 5);

  const summaryCards = [
    {
      title: "Average glucose",
      value:
        summary?.average !== null && summary?.average !== undefined
          ? summary.average.toFixed(1)
          : "—",
      unit: "mg/dL",
      icon: Activity,
      description: "Month-to-date average",
    },
    {
      title: "Highest reading",
      value: summary?.high?.toString() ?? "—",
      unit: "mg/dL",
      icon: TrendingUp,
      description: "Maximum glucose level",
    },
    {
      title: "Lowest reading",
      value: summary?.low?.toString() ?? "—",
      unit: "mg/dL",
      icon: TrendingDown,
      description: "Minimum glucose level",
    },
    {
      title: "Total readings",
      value: summary?.count.toString() ?? (isLoading ? "…" : "0"),
      unit: "",
      icon: Hash,
      description: "Recorded this month",
    },
  ];

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

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
          >
            {error}
          </p>
        )}

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

                <div className="mt-5 flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold text-(--text-primary)">
                    {isLoading ? "…" : card.value}
                  </h2>

                  {card.unit && !isLoading && card.value !== "—" && (
                    <span className="text-xs text-(--text-secondary)">
                      {card.unit}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-(--text-secondary)">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add glucose reading */}
      <section className="mt-8">
        <AddReadingForm onReadingAdded={loadDashboard} />
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

          {isLoading ? (
            <div className="px-5 py-12 text-center text-sm text-(--text-secondary)">
              Loading readings...
            </div>
          ) : recentReadings.length === 0 ? (
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
          ) : (
            <div>
              {recentReadings.map((reading) => (
                <div
                  key={reading.id}
                  className="grid grid-cols-3 items-center gap-3 border-b border-(--app-border) px-5 py-4 last:border-b-0"
                >
                  <span className="text-xs text-(--text-secondary) sm:text-sm">
                    {formatReadingDate(reading.reading_date)}
                  </span>

                  <span className="text-xs font-medium text-(--text-primary) sm:text-sm">
                    {timeSlotLabels[reading.time_slot]}
                  </span>

                  <span className="text-right text-sm font-semibold text-(--text-primary)">
                    {reading.glucose_value}{" "}
                    <span className="text-xs font-normal text-(--text-secondary)">
                      mg/dL
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
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
                Report details coming next.
              </p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;