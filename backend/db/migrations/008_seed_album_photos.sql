-- Seed 9 gallery photos into each of the 9 seeded portfolio albums.
-- Uses subqueries so album IDs don't need to be hardcoded.
-- The 9 image URLs match the hardcoded arrays that existed in the old
-- per-album JSX files (GoldenHourInGalle.jsx, GardenElegance.jsx, etc.)
-- Run once: psql $DATABASE_URL < backend/db/migrations/008_seed_album_photos.sql

DO $$
DECLARE
    album_slugs TEXT[] := ARRAY[
        'golden-hour-in-galle',
        'garden-elegance',
        'kandy-highlands',
        'beachside-romance',
        'city-lights-engagement',
        'colombo-fashion-week',
        'highland-elopement',
        'sunset-pre-shoot',
        'botanical-garden-session'
    ];
    photo_urls TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1658691530647-8b1169ab7352?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1684895603976-6ba905f8d237?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80'
    ];
    photo_alts TEXT[] := ARRAY[
        'Wedding ceremony', 'Golden hour portrait', 'Couple portrait',
        'Bridal detail', 'Celebration', 'Artistic shot',
        'Intimate moment', 'Together forever', 'Love story'
    ];
    current_slug TEXT;
    current_album_id UUID;
    already_has_photos BOOLEAN;
BEGIN
    FOREACH current_slug IN ARRAY album_slugs LOOP
        -- Look up album ID
        SELECT id INTO current_album_id FROM albums WHERE albums.slug = current_slug;
        IF current_album_id IS NULL THEN
            RAISE NOTICE 'Album not found: %', current_slug;
            CONTINUE;
        END IF;

        -- Skip if this album already has photos (idempotent)
        SELECT EXISTS(SELECT 1 FROM photos WHERE photos.album_id = current_album_id) INTO already_has_photos;
        IF already_has_photos THEN
            RAISE NOTICE 'Album % already has photos, skipping', current_slug;
            CONTINUE;
        END IF;

        -- Insert 9 photos
        FOR i IN 1..9 LOOP
            INSERT INTO photos (album_id, url, alt_text, display_order)
            VALUES (current_album_id, photo_urls[i], photo_alts[i], i - 1);
        END LOOP;

        RAISE NOTICE 'Seeded 9 photos for album: %', current_slug;
    END LOOP;
END $$;
