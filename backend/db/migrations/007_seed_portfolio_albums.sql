INSERT INTO albums (title, slug, category, cover_image_url, display_order, is_published) VALUES
    ('Golden Hour in Galle',       'golden-hour-in-galle',       'Weddings',    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 0, true),
    ('Garden Elegance',            'garden-elegance',            'Weddings',    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', 1, true),
    ('Kandy Highlands',            'kandy-highlands',            'Weddings',    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80', 2, true),
    ('Beachside Romance',          'beachside-romance',          'Engagements', 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80', 3, true),
    ('City Lights Engagement',     'city-lights-engagement',     'Engagements', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80', 4, true),
    ('Colombo Fashion Week',       'colombo-fashion-week',       'Editorial',   'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', 5, true),
    ('Highland Elopement',         'highland-elopement',         'Editorial',   'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=800&q=80', 6, true),
    ('Sunset Pre-Shoot',           'sunset-pre-shoot',           'Pre-Shoots',  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 7, true),
    ('Botanical Garden Session',   'botanical-garden-session',   'Pre-Shoots',  'https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f?auto=format&fit=crop&w=800&q=80', 8, true)
ON CONFLICT (slug) DO NOTHING;
