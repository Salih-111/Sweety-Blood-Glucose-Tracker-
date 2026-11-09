
import { useState, type FormEvent } from "react";
import { CalendarDays, Clock3, Droplet, Plus } from "lucide-react";

import { addReading } from "../services/glucoseService";
import type { TimeSlot } from "../types/glucose";

type AddReadingFormProps = {
  onReadingAdded: () => Promise<void>;
};

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function AddReadingForm({ onReadingAdded }: AddReadingFormProps) {
  const today = getTodayDate();

  const [readingDate, setReadingDate] = useState(today);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("morning_fasting");
  const [glucoseValue, setGlucoseValue] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

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

      const response = await addReading({
        reading_date: readingDate,
        time_slot: timeSlot,
        glucose_value: value,
      });

      setMessage(response.message);
      setGlucoseValue("");

      // Refresh dashboard readings and summary cards
      await onReadingAdded();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add reading. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="add-reading"
      className="rounded-2xl border border-(--app-border) bg-(--surface) p-5 sm:p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          <Droplet size={23} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-(--text-primary)">
            Add glucose reading
          </h2>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Record your blood glucose measurement.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-3">
          {/* Reading date */}
          <div>
            <label
              htmlFor="reading-date"
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
                id="reading-date"
                type="date"
                value={readingDate}
                max={today}
                onChange={(event) => setReadingDate(event.target.value)}
                required
                className="w-full rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-10 pr-3 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Time slot */}
          <div>
            <label
              htmlFor="time-slot"
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
                id="time-slot"
                value={timeSlot}
                onChange={(event) =>
                  setTimeSlot(event.target.value as TimeSlot)
                }
                required
                className="w-full appearance-none rounded-xl border border-(--app-border) bg-(--surface) py-3 pl-10 pr-3 text-sm text-(--text-primary) outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
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
              htmlFor="glucose-value"
              className="mb-2 block text-sm font-medium text-(--text-primary)"
            >
              Glucose value (mg/dL)
            </label>

            <input
              id="glucose-value"
              type="number"
              min={40}
              max={600}
              step={1}
              value={glucoseValue}
              onChange={(event) => setGlucoseValue(event.target.value)}
              placeholder="e.g. 120"
              required
              className="w-full rounded-xl border border-(--app-border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) outline-none transition placeholder:text-(--text-secondary) focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="text-sm text-brand-600 dark:text-brand-400">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />
          {isSubmitting ? "Adding reading..." : "Add reading"}
        </button>
      </form>
    </section>
  );
}

export default AddReadingForm;
