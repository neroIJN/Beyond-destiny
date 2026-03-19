CREATE TABLE IF NOT EXISTS albums (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    category        VARCHAR(100) NOT NULL,
    cover_image_url TEXT NOT NULL,
    display_order   INTEGER NOT NULL DEFAULT 0,
    is_published    BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id        UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    alt_text        VARCHAR(255),
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_albums_slug ON albums(slug);
CREATE INDEX IF NOT EXISTS idx_albums_published ON albums(is_published, display_order);
