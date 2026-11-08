import pool from "../config/db.js";

// Validate report date
const validateReportDate = async (date) => {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return "Date must be in YYYY-MM-DD format.";
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return "Please provide a valid date.";
  }

  const result = await pool.query(
    "SELECT CURRENT_DATE::text AS today"
  );

  if (date > result.rows[0].today) {
    return "Future dates are not allowed.";
  }

  return null;
};

// Get summary statistics for a date range
const getSummary = async (userId, startDate, endDate) => {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS count,
       MAX(glucose_value) AS high,
       MIN(glucose_value) AS low,
       ROUND(AVG(glucose_value)::numeric, 1) AS average
     FROM readings
     WHERE user_id = $1
       AND reading_date BETWEEN $2::date AND $3::date`,
    [userId, startDate, endDate]
  );

  const row = result.rows[0];

  return {
    high: row.high,
    low: row.low,
    average: row.average === null ? null : Number(row.average),
    count: row.count,
  };
};

// DAILY REPORT
export const getDailyReport = async (req, res) => {
  const { date } = req.query;

  try {
    const validationError = await validateReportDate(date);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const userId = req.user.userId;

    const summary = await getSummary(userId, date, date);

    const result = await pool.query(
      `SELECT
         id,
         reading_date::text AS reading_date,
         time_slot,
         glucose_value
       FROM readings
       WHERE user_id = $1 AND reading_date = $2::date
       ORDER BY
         CASE time_slot
           WHEN 'morning_fasting' THEN 1
           WHEN 'after_breakfast' THEN 2
           WHEN 'after_lunch' THEN 3
           WHEN 'after_dinner' THEN 4
         END`,
      [userId, date]
    );

    return res.status(200).json({
      reportType: "daily",
      date,
      summary,
      readings: result.rows,
      message:
        summary.count === 0
          ? "No readings found for this date."
          : "Daily report generated successfully.",
    });
  } catch (error) {
    console.error("Daily report error:", error.message);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

// MONTH-TO-DATE REPORT
export const getMonthToDateReport = async (req, res) => {
  const { date } = req.query;

  try {
    const validationError = await validateReportDate(date);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const startDate = `${date.slice(0, 7)}-01`;
    const endDate = date;

    const summary = await getSummary(
      req.user.userId,
      startDate,
      endDate
    );

    return res.status(200).json({
      reportType: "month_to_date",
      startDate,
      endDate,
      summary,
      message:
        summary.count === 0
          ? "No readings found for this period."
          : "Month-to-date report generated successfully.",
    });
  } catch (error) {
    console.error("Month-to-date report error:", error.message);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

// PREVIOUS MONTH REPORT
export const getPreviousMonthReport = async (req, res) => {
  const { date } = req.query;

  try {
    const validationError = await validateReportDate(date);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const [year, month] = date.split("-").map(Number);

    const start = new Date(Date.UTC(year, month - 2, 1));
    const end = new Date(Date.UTC(year, month - 1, 0));

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    const summary = await getSummary(
      req.user.userId,
      startDate,
      endDate
    );

    return res.status(200).json({
      reportType: "previous_month",
      startDate,
      endDate,
      summary,
      message:
        summary.count === 0
          ? "No readings found for the previous month."
          : "Previous month report generated successfully.",
    });
  } catch (error) {
    console.error("Previous month report error:", error.message);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};