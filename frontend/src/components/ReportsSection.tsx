
import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Hash,
  ClipboardList,
} from "lucide-react";

import {
  getDailyReport,
  getMonthToDateReport,
  getPreviousMonthReport,
} from "../services/glucoseService";

import type {
  DailyReport,
  PeriodReport,
  TimeSlot,
} from "../types/glucose";

type ReportPeriod = "daily" | "month-to-date" | "previous-month";

type ReportData = DailyReport | PeriodReport;

const timeSlotLabels: Record<TimeSlot, string> = {
  morning_fasting: "Morning fasting",
  after_breakfast: "After breakfast",
  after_lunch: "After lunch",
  after_dinner: "After dinner",
};

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReportsSection() {
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the selected report
  useEffect(() => {
    let isActive = true;

    const loadReport = async () => {
      try {
        let data: ReportData;

        switch (period) {
          case "daily":
            data = await getDailyReport(selectedDate);
            break;

          case "month-to-date":
            data = await getMonthToDateReport(selectedDate);
            break;

          case "previous-month":
            data = await getPreviousMonthReport(selectedDate);
            break;
        }

        if (isActive) {
          setReport(data);
          setError("");
        }
      } catch (error) {
        if (isActive) {
          setReport(null);
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load report.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadReport();

    return () => {
      isActive = false;
    };
  }, [period, selectedDate]);

  const handlePeriodChange = (nextPeriod: ReportPeriod) => {
    setIsLoading(true);
    setError("");
    setPeriod(nextPeriod);
  };

  const handleDateChange = (nextDate: string) => {
    if (!nextDate) return;

    setIsLoading(true);
    setError("");
    setSelectedDate(nextDate);
  };

  const summary = report?.summary;

  const summaryCards = [
    {
      title: "Average glucose",
      value: summary?.average?.toFixed(1) ?? "—",
      icon: Activity,
    },
    {
      title: "Highest reading",
      value: summary?.high?.toString() ?? "—",
      icon: TrendingUp,
    },
    {
      title: "Lowest reading",
      value: summary?.low?.toString() ?? "—",
      icon: TrendingDown,
    },
    {
      title: "Total readings",
      value: summary?.count.toString() ?? "—",
      icon: Hash,
    },
  ];

  const isDailyReport = report?.reportType === "daily";

  const reportTitle =
    period === "daily"
      ? "Daily report"
      : period === "month-to-date"
        ? "Month-to-date report"
        : "Previous month report";

  return (
    <section
      id="reports"
      className="mt-10 rounded-2xl border border-(--app-border) bg-(--surface) p-5 sm:p-7"
    >
      {/* Section heading */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <ClipboardList size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-(--text-primary)">
              Reports & insights
            </h2>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Review your glucose statistics across different periods.
            </p>
          </div>
        </div>
      </div>

      {/* Report period selection */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Daily", value: "daily" },
          { label: "Month to date", value: "month-to-date" },
          { label: "Previous month", value: "previous-month" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              handlePeriodChange(item.value as ReportPeriod)
            }
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              period === item.value
                ? "bg-brand-600 text-white"
                : "border border-(--app-border) text-(--text-secondary) hover:bg-(--app-bg)"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Date selection */}
      <div className="mt-5 max-w-xs">
        <label
          htmlFor="report-date"
          className="mb-2 block text-sm font-medium text-(--text-primary)"
        >
          Reference date
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)"
          />

          <input
            id="report-date"
            type="date"
            value={selectedDate}
            max={getTodayDate()}
            onChange={(event) => handleDateChange(event.target.value)}
            className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-10 pr-3 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Report heading */}
      <div className="mt-8 border-t border-(--app-border) pt-6">
        <h3 className="text-base font-bold text-(--text-primary)">
          {reportTitle}
        </h3>

        {report && (
          <p className="mt-1 text-sm text-(--text-secondary)">
            {isDailyReport
              ? formatDate(report.date)
              : `${formatDate(report.startDate)} – ${formatDate(report.endDate)}`}
          </p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </p>
      )}

      {/* Summary cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-(--app-border) p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-(--text-secondary)">
                  {card.title}
                </p>

                <Icon
                  size={19}
                  className="text-brand-600 dark:text-brand-400"
                />
              </div>

              <p className="mt-4 text-2xl font-bold text-(--text-primary)">
                {isLoading ? "…" : card.value}
                {card.title !== "Total readings" &&
                  card.value !== "—" &&
                  !isLoading && (
                    <span className="ml-1 text-xs font-normal text-(--text-secondary)">
                      mg/dL
                    </span>
                  )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Daily readings */}
      {period === "daily" && (
        <div className="mt-8">
          <h3 className="mb-4 font-semibold text-(--text-primary)">
            Daily readings
          </h3>

          {isLoading ? (
            <p className="py-8 text-center text-sm text-(--text-secondary)">
              Loading report...
            </p>
          ) : error ? null : isDailyReport && report.readings.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-(--app-border)">
              <table className="w-full min-w-400px text-left text-sm">
                <thead className="bg-(--app-bg) text-xs uppercase text-(--text-secondary)">
                  <tr>
                    <th className="px-4 py-3">Time slot</th>
                    <th className="px-4 py-3 text-right">Glucose</th>
                  </tr>
                </thead>

                <tbody>
                  {report.readings.map((reading) => (
                    <tr
                      key={reading.id}
                      className="border-t border-(--app-border)"
                    >
                      <td className="px-4 py-3 text-(--text-primary)">
                        {timeSlotLabels[reading.time_slot]}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-(--text-primary)">
                        {reading.glucose_value} mg/dL
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-(--app-border) px-5 py-10 text-center">
              <Activity
                size={26}
                className="mx-auto mb-3 text-(--text-secondary)"
              />

              <p className="text-sm font-semibold text-(--text-primary)">
                No readings found
              </p>

              <p className="mt-1 text-xs text-(--text-secondary)">
                There are no glucose readings for this date.
              </p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && summary?.count === 0 && period !== "daily" && (
        <div className="mt-6 rounded-xl border border-dashed border-(--app-border) px-5 py-8 text-center">
          <p className="text-sm font-semibold text-(--text-primary)">
            No readings found for this period
          </p>

          <p className="mt-1 text-xs text-(--text-secondary)">
            Your statistics will appear here when readings are available.
          </p>
        </div>
      )}
    </section>
  );
}

export default ReportsSection;
