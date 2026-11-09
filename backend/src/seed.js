import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "./config/db.js";

const DEMO_USER = {
  name: "Demo User",
  email: "demo@sweety.com",
  password: "DemoPass123",
};

// Format JavaScript Date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().slice(0, 10);
};

// Calculate a date relative to another date
const shiftDate = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return formatDate(date);
};

const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get today's date from PostgreSQL
    const dateResult = await client.query(
      "SELECT CURRENT_DATE::text AS today"
    );

    const today = dateResult.rows[0].today;

    // Generate bcrypt password hash
    const passwordHash = await bcrypt.hash(
      DEMO_USER.password,
      10
    );

    // Create or update demo user
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash
       RETURNING id`,
      [
        DEMO_USER.name,
        DEMO_USER.email,
        passwordHash,
      ]
    );

    const userId = userResult.rows[0].id;

    // Calculate previous month's last day
    const [year, month] = today.split("-").map(Number);

    const previousMonthEnd = formatDate(
      new Date(Date.UTC(year, month - 1, 0))
    );

    // Sample glucose readings
    const readings = [
      {
        date: today,
        slot: "morning_fasting",
        value: 112,
      },
      {
        date: today,
        slot: "after_breakfast",
        value: 148,
      },
      {
        date: shiftDate(today, -1),
        slot: "morning_fasting",
        value: 108,
      },
      {
        date: shiftDate(today, -1),
        slot: "after_lunch",
        value: 136,
      },
      {
        date: shiftDate(today, -3),
        slot: "after_dinner",
        value: 129,
      },
      {
        date: previousMonthEnd,
        slot: "morning_fasting",
        value: 106,
      },
      {
        date: shiftDate(previousMonthEnd, -4),
        slot: "after_dinner",
        value: 142,
      },
    ];

    // Insert readings without creating duplicates
    for (const reading of readings) {
      await client.query(
        `INSERT INTO readings
         (user_id, reading_date, time_slot, glucose_value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, reading_date, time_slot)
         DO UPDATE SET glucose_value = EXCLUDED.glucose_value`,
        [
          userId,
          reading.date,
          reading.slot,
          reading.value,
        ]
      );
    }

    await client.query("COMMIT");

    console.log("Demo data seeded successfully!");
    console.log("Demo email:", DEMO_USER.email);
    console.log("Demo password:", DEMO_USER.password);
    console.log("Sample readings:", readings.length);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Seed error:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

seedDatabase();