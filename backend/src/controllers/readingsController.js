import pool from "../config/db.js"

const allowedTimeSlots = [
  "morning_fasting",
  "after_breakfast",
  "after_lunch",
  "after_dinner",
]

// Validate reading input
const validateReading = async (reading_date, time_slot, glucose_value) => {
  // Validate date format
  if (
    typeof reading_date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(reading_date)
  ) {
    return "Date must be in YYYY-MM-DD format."
  }

  const parsedDate = new Date(`${reading_date}T00:00:00.000Z`)

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== reading_date
  ) {
    return "Please provide a valid date."
  }

  // Validate time slot
  if (!allowedTimeSlots.includes(time_slot)) {
    return "Invalid time slot."
  }

  // Validate glucose value
  if (
    !Number.isInteger(glucose_value) ||
    glucose_value < 40 ||
    glucose_value > 600
  ) {
    return "Glucose value must be a whole number between 40 and 600."
  }

  // Prevent future dates using the database's current date
  const result = await pool.query("SELECT CURRENT_DATE::text AS today")
  const today = result.rows[0].today

  if (reading_date > today) {
    return "Future dates are not allowed."
  }

  return null
}

// CREATE a reading
export const createReading = async (req, res) => {
  const { reading_date, time_slot, glucose_value } = req.body

  try {
    const validationError = await validateReading(
      reading_date,
      time_slot,
      glucose_value,
    )

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const result = await pool.query(
      `INSERT INTO readings
       (user_id, reading_date, time_slot, glucose_value)
       VALUES ($1, $2, $3, $4)
       RETURNING id, reading_date::text AS reading_date, time_slot, glucose_value, created_at`,
      [req.user.userId, reading_date, time_slot, glucose_value],
    )

    return res.status(201).json({
      message: "Reading added successfully.",
      reading: result.rows[0],
    })
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A reading already exists for this time slot on this date.",
      })
    }

    console.error("Create reading error:", error.message)

    return res.status(500).json({
      message: "Something went wrong.",
    })
  }
}

// READ all readings for the logged-in user
export const getReadings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reading_date::text AS reading_date, time_slot, glucose_value, created_at
       FROM readings
       WHERE user_id = $1
       ORDER BY reading_date DESC,
       CASE time_slot
         WHEN 'morning_fasting' THEN 1
         WHEN 'after_breakfast' THEN 2
         WHEN 'after_lunch' THEN 3
         WHEN 'after_dinner' THEN 4
       END ASC`,
      [req.user.userId],
    )

    return res.status(200).json({
      count: result.rows.length,
      readings: result.rows,
    })
  } catch (error) {
    console.error("Get readings error:", error.message)

    return res.status(500).json({
      message: "Something went wrong.",
    })
  }
}

// READ one reading
export const getReading = async (req, res) => {
  const readingId = Number(req.params.id)

  if (!Number.isInteger(readingId) || readingId < 1) {
    return res.status(400).json({ message: "Invalid reading ID." })
  }

  try {
    const result = await pool.query(
      `SELECT id, reading_date::text AS reading_date, time_slot, glucose_value, created_at
       FROM readings
       WHERE id = $1 AND user_id = $2`,
      [readingId, req.user.userId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reading not found." })
    }

    return res.status(200).json({
      reading: result.rows[0],
    })
  } catch (error) {
    console.error("Get reading error:", error.message)

    return res.status(500).json({
      message: "Something went wrong.",
    })
  }
}

// UPDATE a reading
export const updateReading = async (req, res) => {
  const readingId = Number(req.params.id)
  const { reading_date, time_slot, glucose_value } = req.body

  if (!Number.isInteger(readingId) || readingId < 1) {
    return res.status(400).json({ message: "Invalid reading ID." })
  }

  try {
    const validationError = await validateReading(
      reading_date,
      time_slot,
      glucose_value,
    )

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const result = await pool.query(
      `UPDATE readings
       SET reading_date = $1,
           time_slot = $2,
           glucose_value = $3
       WHERE id = $4 AND user_id = $5
       RETURNING id, reading_date::text AS reading_date, time_slot, glucose_value, created_at`,
      [reading_date, time_slot, glucose_value, readingId, req.user.userId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reading not found." })
    }

    return res.status(200).json({
      message: "Reading updated successfully.",
      reading: result.rows[0],
    })
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A reading already exists for this time slot on this date.",
      })
    }

    console.error("Update reading error:", error.message)

    return res.status(500).json({
      message: "Something went wrong.",
    })
  }
}

// DELETE a reading
export const deleteReading = async (req, res) => {
  const readingId = Number(req.params.id)

  if (!Number.isInteger(readingId) || readingId < 1) {
    return res.status(400).json({ message: "Invalid reading ID." })
  }

  try {
    const result = await pool.query(
      `DELETE FROM readings
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [readingId, req.user.userId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reading not found." })
    }

    return res.status(200).json({
      message: "Reading deleted successfully.",
    })
  } catch (error) {
    console.error("Delete reading error:", error.message)

    return res.status(500).json({
      message: "Something went wrong.",
    })
  }
}
