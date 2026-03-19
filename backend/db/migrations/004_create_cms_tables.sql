-- Hero slides for the homepage hero slider
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    quote TEXT NOT NULL,
    couple VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating SMALLINT NOT NULL DEFAULT 5,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- "Stories We've Told" dark showcase items
CREATE TABLE showcase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site-wide key-value settings (contact info, hero text, etc.)
CREATE TABLE site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed with current hardcoded values so the site works immediately after migration
INSERT INTO site_settings (key, value) VALUES
    ('contact_email',   'Info@LenseroStudios.Com'),
    ('contact_phone',   '+94 77 456 7890'),
    ('contact_address', '42 Light Avenue, Colombo 03, Sri Lanka'),
    ('contact_hours',   'Mon – Sat: 9AM – 6PM'),
    ('hero_title',      'CAPTURED MOMENTS'),
    ('hero_tagline',    'Crafted with passion, from the heart')
ON CONFLICT (key) DO NOTHING;
