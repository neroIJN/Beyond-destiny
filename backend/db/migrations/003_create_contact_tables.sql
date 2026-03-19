CREATE TABLE IF NOT EXISTS contact_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    wedding_date    DATE,
    venue           VARCHAR(255),
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT false,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quote_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    names           VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    event_type      VARCHAR(50) NOT NULL,
    event_date      DATE,
    event_venue     VARCHAR(255),
    budget          VARCHAR(50),
    hear_about_us   VARCHAR(255),
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT false,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
