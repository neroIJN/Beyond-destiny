-- Team members for the About page
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed with current hardcoded team members
INSERT INTO team_members (name, role, image_url, display_order) VALUES
    ('Ashen Perera',      'Lead Photographer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 0),
    ('Nadeesha De Silva', 'Creative Director', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 1),
    ('Kavindu Fernando',  'Cinematographer',   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 2);

-- Seed about page content into site_settings
INSERT INTO site_settings (key, value) VALUES
    ('about_hero_image_url',  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80'),
    ('about_story_image_url', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'),
    ('about_story_p1', 'Founded in the heart of Sri Lanka, Lensero Studios was born from a passion for storytelling through light and emotion. What began as a solo journey with a camera has evolved into a collective of artists dedicated to preserving love stories in their most authentic form.'),
    ('about_story_p2', 'We believe that every love story is a unique work of art, deserving of imagery that captures not just the events, but the feelings, the atmosphere, and the intimate connections that make each wedding extraordinary.'),
    ('about_phil1_title', 'Authentic Emotion'),
    ('about_phil1_desc',  'We capture raw, unscripted moments that tell the true story of your day.'),
    ('about_phil2_title', 'Editorial Elegance'),
    ('about_phil2_desc',  'Magazine-worthy compositions with an artistic eye for light and detail.'),
    ('about_phil3_title', 'Timeless Beauty'),
    ('about_phil3_desc',  'Images that will feel as fresh and moving in fifty years as they do today.')
ON CONFLICT (key) DO NOTHING;
