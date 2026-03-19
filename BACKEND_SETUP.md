# Backend Setup Guide

Step-by-step instructions for getting the **Captured Moments** backend running from scratch on a new machine.

---

## Prerequisites

Make sure the following are installed before you begin:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Go | 1.21+ | `go version` |
| PostgreSQL | 14+ | `psql --version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | any | `git --version` |

---

## 1. Clone the Repository

```bash
git clone <repo-url>
cd captured-moments
```

---

## 2. Create the PostgreSQL Database

**Linux / macOS (psql):**
```bash
psql -U postgres -c "CREATE DATABASE captured_moments;"
```

**Windows (open psql prompt first, then run):**
```sql
CREATE DATABASE captured_moments;
```

If your PostgreSQL user is not `postgres`, substitute your username:
```bash
psql -U your_username -c "CREATE DATABASE captured_moments;"
```

---

## 3. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Now open `.env` in your editor and fill in the values:

```env
# Server
PORT=8080
FRONTEND_URL=http://localhost:5173

# PostgreSQL
# Format: postgres://user:password@host:port/dbname
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/captured_moments

# JWT Secret — generate a strong random string:
#   openssl rand -hex 32
JWT_SECRET=your-super-secret-jwt-key-change-this

# Backblaze B2 Storage
# Get these from your B2 account → App Keys
# Endpoint format: https://s3.us-east-005.backblazeb2.com  (check your bucket's region)
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
B2_KEY_ID=your-b2-key-id
B2_APPLICATION_KEY=your-b2-application-key
B2_BUCKET_NAME=your-bucket-name
# Public URL format: https://fXXX.backblazeb2.com/file/your-bucket-name
# Replace fXXX with your region number (e.g. f005 for us-east-005)
B2_PUBLIC_BASE_URL=https://f005.backblazeb2.com/file/your-bucket-name

# Email — optional; form submissions save to DB even without this
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-gmail-app-password   # use a Gmail App Password, not your real password
NOTIFY_EMAIL=owner@yourstudio.com
```

> **B2 tip:** If you don't have Backblaze B2 set up yet, the server will still start — only image uploads will fail. You can add B2 credentials later.
>
> **Email tip:** SMTP config is fully optional. Contact and quote form submissions are always saved to the database. Email notifications are just a bonus.

---

## 4. Install Go Dependencies

```bash
# From the backend/ directory
go mod download
```

---

## 5. Run Database Migrations

Migrations must be run **in order**. Each file creates tables or seeds data that later files depend on.

### Run each migration individually:

```bash
psql $DATABASE_URL -f db/migrations/001_create_admin_users.sql
psql $DATABASE_URL -f db/migrations/002_create_albums.sql
psql $DATABASE_URL -f db/migrations/003_create_contact_tables.sql
psql $DATABASE_URL -f db/migrations/004_create_cms_tables.sql
psql $DATABASE_URL -f db/migrations/005_create_team_members.sql
psql $DATABASE_URL -f db/migrations/006_create_album_categories.sql
psql $DATABASE_URL -f db/migrations/007_seed_portfolio_albums.sql
psql $DATABASE_URL -f db/migrations/008_seed_album_photos.sql
psql $DATABASE_URL -f db/migrations/009_create_services.sql
```

### Or run all in one shot (Linux / macOS):

```bash
for f in db/migrations/*.sql; do echo "Running $f..."; psql $DATABASE_URL -f "$f"; done
```

### Windows (PowerShell):

```powershell
foreach ($f in Get-ChildItem db\migrations\*.sql | Sort-Object Name) {
    Write-Host "Running $($f.Name)..."
    psql $env:DATABASE_URL -f $f.FullName
}
```

### What each migration does:

| # | File | Creates / Seeds |
|---|------|-----------------|
| 001 | `001_create_admin_users.sql` | `admin_users` table |
| 002 | `002_create_albums.sql` | `albums` + `photos` tables |
| 003 | `003_create_contact_tables.sql` | `contact_submissions` + `quote_requests` tables |
| 004 | `004_create_cms_tables.sql` | `hero_slides`, `testimonials`, `showcase_items`, `site_settings` tables + seeds default contact info and hero text |
| 005 | `005_create_team_members.sql` | `team_members` table + seeds 3 team members + about page settings |
| 006 | `006_create_album_categories.sql` | `album_categories` table + seeds 4 categories (Weddings, Engagements, Editorial, Pre-Shoots) |
| 007 | `007_seed_portfolio_albums.sql` | Seeds 9 portfolio albums |
| 008 | `008_seed_album_photos.sql` | Seeds 9 photos per album (81 total) |
| 009 | `009_create_services.sql` | `services` table + seeds 3 services (Weddings, Portraits, Events) |

> **Note:** Migrations 007 and 008 use `ON CONFLICT DO NOTHING`, so re-running them is safe.

---

## 6. Seed the Admin User

Create the first admin account (used to log into `/admin`):

```bash
go run ./cmd/seed/main.go
```

The script will prompt you:
```
Admin email: admin@yourstudio.com
Admin password: (your chosen password)
Admin name: Your Name
```

You can re-run this command to update an existing admin's password.

---

## 7. Start the Backend Server

```bash
go run main.go
```

Expected output:
```
[GIN-debug] ...
Server starting on port 8080
```

### Or build a binary (faster for production):

```bash
go build -o captured-moments-server .
./captured-moments-server
```

---

## 8. Frontend Setup (Quick Reference)

```bash
cd ../frontend
npm install
npm run dev        # dev server at http://localhost:5173 (proxies /api → :8080)
```

For production:
```bash
npm run build      # outputs to frontend/dist/
```

The backend serves the built frontend automatically from `../frontend/dist/` when you run it as a binary.

---

## 9. Verify Everything Works

Run through this checklist after setup:

- [ ] `curl http://localhost:8080/api/albums` → returns a JSON array of 9 albums
- [ ] `curl http://localhost:8080/api/services` → returns 3 services (Weddings, Portraits, Events)
- [ ] `curl http://localhost:8080/api/album-categories` → returns 4 categories
- [ ] Visit `http://localhost:5173` → public site loads with content
- [ ] Visit `http://localhost:5173/portfolio` → 9 portfolio albums visible
- [ ] Visit `http://localhost:5173/admin` → redirects to login page
- [ ] Log in with your seeded credentials → admin dashboard loads
- [ ] Admin → Albums → 9 albums listed
- [ ] Admin → Services → 3 services listed
- [ ] Admin → Categories → 4 categories listed

---

## 10. Troubleshooting

### "Failed to connect to database" on startup
- Check that PostgreSQL is running: `pg_isready -U postgres`
- Verify `DATABASE_URL` format: `postgres://user:password@host:port/dbname`
- Make sure the database exists: `psql -U postgres -l | grep captured_moments`

### "relation does not exist" errors
- Migrations haven't been run, or were run out of order.
- Run them again in order (step 5). All migrations use `CREATE TABLE IF NOT EXISTS` or `ON CONFLICT DO NOTHING`, so re-running is safe.

### "invalid JWT secret" or auth errors
- `JWT_SECRET` is not set in `.env`, or `.env` is not in the `backend/` directory when you run the server.
- Generate a good secret: `openssl rand -hex 32`

### Image upload returns 500 error
- B2 credentials are wrong or incomplete.
- Check `B2_ENDPOINT` format: must be `https://s3.REGION.backblazeb2.com` (e.g. `https://s3.us-east-005.backblazeb2.com`)
- Check `B2_PUBLIC_BASE_URL` format: must be `https://fXXX.backblazeb2.com/file/bucket-name` — **not** the S3 endpoint URL.
- The region number in `fXXX` must match your bucket's region (e.g. `us-east-005` → `f005`).

### CORS errors in the browser
- `FRONTEND_URL` in `.env` doesn't match your frontend origin exactly (including the port).
- Default: `FRONTEND_URL=http://localhost:5173`

### "Port already in use"
- Something else is running on port 8080.
- Change `PORT=8081` in `.env` and update the Vite proxy in `frontend/vite.config.js` to point to `:8081`.

### Contact / quote form shows "Something went wrong"
- The backend is not running, or the Vite dev proxy can't reach it.
- Make sure `go run main.go` is running in a separate terminal.
- Check the backend terminal for error output.

### Admin page shows "0 photos" for an album
- Run migration 008 to seed photos: `psql $DATABASE_URL -f db/migrations/008_seed_album_photos.sql`

---

## Quick Reference — All Commands

```bash
# 1. Clone
git clone <repo-url> && cd captured-moments

# 2. Database
psql -U postgres -c "CREATE DATABASE captured_moments;"

# 3. Backend setup
cd backend
cp .env.example .env
# Edit .env with your values
go mod download

# 4. Run all migrations
for f in db/migrations/*.sql; do psql $DATABASE_URL -f "$f"; done

# 5. Seed admin user
go run ./cmd/seed/main.go

# 6. Start backend
go run main.go

# 7. Start frontend (separate terminal)
cd ../frontend
npm install
npm run dev
```
