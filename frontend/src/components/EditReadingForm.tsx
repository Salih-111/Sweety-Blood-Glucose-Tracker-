
import { useState, type FormEvent } from "react";
import { CalendarDays, Clock3, Droplet, X } from "lucide-react";

import { updateReading } from "../services/glucoseService";
import type { GlucoseReading, TimeSlot } from "../types/glucose";

type EditReadingFormProps = {
  reading: GlucoseReading;
  onReadingUpdated: () => Promise<void>;
  onCancel: () => void;
};

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function EditReadingForm({
  reading,
  onReadingUpdated,
  onCancel,
}: EditReadingFormProps) {
  const today = getTodayDate();

  // Initialize form with existing reading details
  const [readingDate, setReadingDate] = useState(reading.reading_date);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(reading.time_slot);
  const [glucoseValue, setGlucoseValue] = useState(
    String(reading.glucose_value),
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const value = Number(glucoseValue);

    if (!Number.isInteger(value) || value < 40 || value > 600) {
      setError("Glucose value must be a whole number between 40 and 600.");
      return;
    }

    if (readingDate > today) {
      setError("Future dates are not allowed.");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateReading(reading.id, {
        reading_date: readingDate,
        time_slot: timeSlot,
        glucose_value: value,
      });

      await onReadingUpdated();

      onCancel();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update reading. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-reading-title"
        className="w-full max-w-2xl rounded-2xl border border-(--app-border) bg-(--surface) p-5 shadow-2xl sm:p-7"
      >
        {/* Modal header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <Droplet size={23} />
            </div>

            <div>
              <h2
                id="edit-reading-title"
                className="text-lg font-bold text-(--text-primary)"
              >
                Edit glucose reading
              </h2>

              <p className="mt-1 text-sm text-(--text-secondary)">
                Update your recorded measurement.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close edit reading form"
            className="rounded-lg p-2 text-(--text-secondary) transition hover:bg-(--app-bg) hover:text-(--text-primary) disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            {/* Reading date */}
            <div>
              <label
                htmlFor="edit-reading-date"
                className="mb-2 block text-sm font-medium text-(--text-primary)"
              >
                Reading date
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)"
                />

                <input
                  id="edit-reading-date"
                  type="date"
                  value={readingDate}
                  max={today}
                  onChange={(event) => setReadingDate(event.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-10 pr-2 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Time slot */}
            <div>
              <label
                htmlFor="edit-time-slot"
                className="mb-2 block text-sm font-medium text-(--text-primary)"
              >
                Time slot
              </label>

              <div className="relative">
                <Clock3
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)"
                />

                <select
                  id="edit-time-slot"
                  value={timeSlot}
                  onChange={(event) =>
                    setTimeSlot(event.target.value as TimeSlot)
                  }
                  required
                  disabled={isSubmitting}
                  className="w-full appearance-none rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-10 pr-2 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="morning_fasting">Morning fasting</option>
                  <option value="after_breakfast">After breakfast</option>
                  <option value="after_lunch">After lunch</option>
                  <option value="after_dinner">After dinner</option>
                </select>
              </div>
            </div>

            {/* Glucose value */}
            <div>
              <label
                htmlFor="edit-glucose-value"
                className="mb-2 block text-sm font-medium text-(--text-primary)"
              >
                Glucose value (mg/dL)
              </label>

              <input
                id="edit-glucose-value"
                type="number"
                min={40}
                max={600}
                step={1}
                value={glucoseValue}
                onChange={(event) => setGlucoseValue(event.target.value)}
                required
                disabled={isSubmitting}
                className="w-full rounded-xl border border-(--app-border) bg-(--surface) px-3 py-3 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-(--app-border) pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-(--app-border) px-5 py-3 text-sm font-semibold text-(--text-secondary) transition hover:bg-(--app-bg) disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditReadingForm;
