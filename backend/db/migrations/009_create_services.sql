CREATE TABLE services (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(255) NOT NULL,
    icon_name     VARCHAR(50)  NOT NULL DEFAULT 'camera',
    image_url     TEXT         NOT NULL,
    description   TEXT         NOT NULL DEFAULT '',
    features      TEXT[]       NOT NULL DEFAULT '{}',
    display_order INTEGER      NOT NULL DEFAULT 0,
    is_active     BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Seed with the 3 hardcoded services currently in ServicesSection.jsx
INSERT INTO services (title, icon_name, image_url, description, features, display_order) VALUES
(
    'Weddings',
    'heart',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'Full-day wedding coverage with a focus on authentic moments and timeless imagery.',
    ARRAY['8+ hours coverage', 'Two photographers', 'Online gallery', 'Print-ready files'],
    0
),
(
    'Portraits',
    'camera',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    'Personal and professional portrait sessions that capture your unique personality.',
    ARRAY['2-hour session', 'Location scouting', 'Wardrobe guidance', '25+ edited images'],
    1
),
(
    'Events',
    'sparkles',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    'Corporate events, celebrations, and special occasions documented beautifully.',
    ARRAY['Flexible hours', 'Quick turnaround', 'Social media ready', 'Highlight reel'],
    2
);
