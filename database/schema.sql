-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Readings table
CREATE TABLE readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL
        CHECK (time_slot IN (
            'morning_fasting',
            'after_breakfast',
            'after_lunch',
            'after_dinner'
        )),
    glucose_value INTEGER NOT NULL
        CHECK (glucose_value BETWEEN 40 AND 600),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_date_slot
        UNIQUE (user_id, reading_date, time_slot)
);