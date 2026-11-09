export type TimeSlot =
  | "morning_fasting"
  | "after_breakfast"
  | "after_lunch"
  | "after_dinner";

export type GlucoseReading = {
  id: number;
  reading_date: string;
  time_slot: TimeSlot;
  glucose_value: number;
  created_at: string;
};

export type ReadingsResponse = {
  count: number;
  readings: GlucoseReading[];
};

export type ReportSummary = {
  high: number | null;
  low: number | null;
  average: number | null;
  count: number;
};

export type DailyReport = {
  reportType: "daily";
  date: string;
  summary: ReportSummary;
  readings: GlucoseReading[];
  message: string;
};

export type PeriodReport = {
  reportType: "month_to_date" | "previous_month";
  startDate: string;
  endDate: string;
  summary: ReportSummary;
  message: string;
};