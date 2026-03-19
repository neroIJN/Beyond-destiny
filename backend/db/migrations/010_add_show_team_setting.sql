-- Add toggle for "Meet The Team" section on About page
INSERT INTO site_settings (key, value) VALUES
    ('show_team_section', 'true')
ON CONFLICT (key) DO NOTHING;
