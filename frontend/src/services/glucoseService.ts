import apiRequest from "./api";

import type {
  GlucoseReading,
  ReadingsResponse,
  DailyReport,
  PeriodReport,
  TimeSlot,
} from "../types/glucose";

export type ReadingInput = {
  reading_date: string;
  time_slot: TimeSlot;
  glucose_value: number;
};

// Get all readings
export const getReadings = () => {
  return apiRequest<ReadingsResponse>("/readings");
};

// Add a new reading
export const addReading = (reading: ReadingInput) => {
  return apiRequest<{
    message: string;
    reading: GlucoseReading;
  }>("/readings", {
    method: "POST",
    body: JSON.stringify(reading),
  });
};

// Update an existing reading
export const updateReading = (
  id: number,
  reading: ReadingInput,
) => {
  return apiRequest<{
    message: string;
    reading: GlucoseReading;
  }>(`/readings/${id}`, {
    method: "PUT",
    body: JSON.stringify(reading),
  });
};

// Delete a reading
export const deleteReading = (id: number) => {
  return apiRequest<{ message: string }>(`/readings/${id}`, {
    method: "DELETE",
  });
};

// Get daily report
export const getDailyReport = (date: string) => {
  const params = new URLSearchParams({ date });

  return apiRequest<DailyReport>(
    `/reports/daily?${params.toString()}`,
  );
};

// Get month-to-date report
export const getMonthToDateReport = (date: string) => {
  const params = new URLSearchParams({ date });

  return apiRequest<PeriodReport>(
    `/reports/month-to-date?${params.toString()}`,
  );
};

// Get previous month report
export const getPreviousMonthReport = (date: string) => {
  const params = new URLSearchParams({ date });

  return apiRequest<PeriodReport>(
    `/reports/previous-month?${params.toString()}`,
  );
};