CREATE TABLE album_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO album_categories (name, display_order) VALUES
    ('Weddings',    0),
    ('Engagements', 1),
    ('Editorial',   2),
    ('Pre-Shoots',  3);
