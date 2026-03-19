<div align="center">

# ✨ Captured Moments

### Luxury Wedding Photography — Where Every Frame Tells a Love Story

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Go](https://img.shields.io/badge/Go-1.25-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Gin](https://img.shields.io/badge/Gin-1.11-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

*A full-stack wedding photography portfolio platform crafted with modern web technologies, delivering an immersive, cinematic browsing experience with smooth animations and elegant design.*

---

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Pages](#-pages)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Production Build & Deployment](#-production-build--deployment)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Captured Moments** is a premium wedding photography portfolio website designed to showcase editorial-quality imagery with cinematic elegance. The platform combines a blazing-fast React frontend with a lightweight, high-performance Go backend, delivering an experience that feels as refined as the moments it captures.

The application features scroll-triggered animations, parallax effects, page transitions, a masonry gallery layout, and a fully functional contact system — all wrapped in a responsive design that looks stunning on every device.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React 19 SPA (Vite 7)                   │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────────┐ │  │
│  │  │  React   │ │  Framer  │ │    Swiper.js       │ │  │
│  │  │  Router  │ │  Motion  │ │  (Hero Slider)     │ │  │
│  │  │   v7     │ │ (Anim.)  │ │                    │ │  │
│  │  └─────────┘ └──────────┘ └────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         Component Layer                     │  │  │
│  │  │  Navigation · HeroSlider · MasonryGrid      │  │  │
│  │  │  StatsCounter · ParallaxBand · Footer        │  │  │
│  │  │  Testimonials · Services · Blog · Contact    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│                   HTTP Requests                          │
│                    (API Calls)                           │
└──────────────────────────┬──────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Gin Web   │
                    │   Server    │
                    │  (Port 8080)│
                    ├─────────────┤
                    │  /api/*     │  ← REST API Endpoints
                    │  /assets/*  │  ← Static File Serving
                    │  /*         │  ← SPA Catch-All (index.html)
                    └─────────────┘
                     Go (Golang)
                     Backend
```

### Request Flow

1. **Static Assets** — The Go server serves the compiled React build (`dist/`) directly, including JS bundles, CSS, and images via the `/assets/*` route.
2. **API Calls** — The frontend communicates with the backend through RESTful endpoints under `/api/*` for dynamic data (portfolio items, contact form submissions).
3. **SPA Routing** — Any non-API, non-asset route is caught by the catch-all handler, which serves `index.html`, allowing React Router to handle client-side navigation seamlessly.

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2 | UI component library |
| **Vite** | 7.3 | Build tool & dev server |
| **React Router** | 7.13 | Client-side routing with animated transitions |
| **Framer Motion** | 12.34 | Page transitions & scroll animations |
| **Swiper** | 12.1 | Touch-enabled hero slider with fade effects |
| **React Icons** | 5.5 | Icon library |
| **Vanilla CSS** | — | Custom styling with CSS variables, no UI framework |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Go (Golang)** | 1.25 | Server-side runtime |
| **Gin** | 1.11 | High-performance HTTP web framework |

### Typography

The design uses a curated set of Google Fonts for an editorial aesthetic:
- **Cormorant Garamond** — Elegant serif for headings
- **Playfair Display** — Classic serif for accent text
- **DM Sans** — Clean sans-serif for body copy
- **Raleway** — Light sans-serif for UI elements

---

## ✨ Features

### Visual & Interactive
- **Hero Slider** — Full-screen Swiper carousel with fade transitions, autoplay, and animated text overlays
- **Masonry Grid** — CSS-based Pinterest-style layout for portfolio highlights with hover effects
- **Parallax Band** — Scroll-driven parallax sections for immersive storytelling
- **Stats Counter** — Scroll-triggered animated number counters (weddings shot, years of experience, etc.)
- **Dark Showcase** — Dramatic dark-themed gallery sections for visual impact
- **Video Section** — Embedded cinematic video content
- **Signature Section** — Personalized branding element

### Navigation & UX
- **Responsive Navigation** — Sticky header that adapts across breakpoints with a mobile hamburger menu and sidebar
- **Sidebar Menu** — Elegant off-canvas navigation for mobile devices
- **Scroll-to-Top** — Floating button for quick return to top
- **Page Transitions** — Smooth animated transitions between routes using Framer Motion's `AnimatePresence`
- **Fade-In / Reveal Animations** — Scroll-triggered entrance animations for content sections

### Functional
- **Portfolio Gallery** — Dynamic gallery powered by backend API data
- **Contact Form** — Fully functional contact form with backend processing
- **Blog Section** — Editorial-style blog layout
- **Testimonials** — Client review carousel/section
- **Services Showcase** — Detailed service offerings

### Performance
- **Vite Build** — Lightning-fast HMR in development, optimized production bundles
- **Static Serving** — Go backend serves pre-built assets for maximum throughput
- **Minimal Dependencies** — No bulky CSS framework; hand-crafted vanilla CSS

---

## 📄 Pages

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Landing page with hero slider, masonry highlights, stats, parallax, testimonials, blog preview, and signature section |
| `/about` | **About** | Studio story, team, philosophy, and behind-the-scenes |
| `/portfolio` | **Portfolio** | Full wedding photography portfolio with category filters |
| `/gallery` | **Gallery** | Curated image gallery with lightbox viewing |
| `/blog` | **Blog** | Editorial articles, wedding stories, and photography tips |
| `/contact` | **Contact** | Contact form, studio location, and booking information |

---

## 📡 API Reference

### `GET /api/portfolio`

Returns the portfolio gallery items.

**Response** `200 OK`

```json
{
  "items": [
    {
      "id": 1,
      "src": "https://example.com/image.jpg",
      "title": "Eternal Moments",
      "category": "Moments"
    }
  ]
}
```

### `POST /api/contact`

Handles contact form submissions.

**Response** `200 OK`

```json
{
  "status": "received",
  "message": "Thank you for contacting us!"
}
```

---

## 📁 Project Structure

```
captured-moments/
├── README.md
│
├── backend/                        # Go backend server
│   ├── go.mod                      # Go module dependencies
│   └── main.go                     # Server entry point, routes & handlers
│
└── frontend/                       # React frontend application
    ├── index.html                  # HTML entry point with meta & fonts
    ├── package.json                # Node.js dependencies & scripts
    ├── vite.config.js              # Vite build configuration
    ├── eslint.config.js            # ESLint code quality rules
    │
    ├── public/                     # Static public assets
    │
    └── src/
        ├── main.jsx                # React DOM entry point
        ├── App.jsx                 # Root component with routing
        ├── App.css                 # Global application styles
        ├── index.css               # Base/reset styles
        │
        ├── assets/                 # Images, icons & media
        │
        ├── components/             # Reusable UI components
        │   ├── Navigation.jsx      # Responsive sticky header
        │   ├── Sidebar.jsx         # Mobile off-canvas menu
        │   ├── HeroSlider.jsx      # Full-screen Swiper hero
        │   ├── MasonryGrid.jsx     # Pinterest-style photo grid
        │   ├── StatsCounter.jsx    # Animated number counters
        │   ├── ParallaxBand.jsx    # Scroll parallax sections
        │   ├── DarkShowcase.jsx    # Dark-themed gallery section
        │   ├── VideoSection.jsx    # Embedded video content
        │   ├── ServicesSection.jsx  # Service offerings display
        │   ├── TestimonialsSection.jsx  # Client testimonials
        │   ├── BlogSection.jsx     # Blog preview cards
        │   ├── ContactSection.jsx  # Contact form component
        │   ├── FeaturesSection.jsx # Feature highlights
        │   ├── SignatureSection.jsx # Branding signature
        │   ├── Footer.jsx          # Main site footer
        │   ├── MinimalFooter.jsx   # Simplified footer variant
        │   ├── ScrollToTop.jsx     # Scroll-to-top button
        │   ├── FadeIn.jsx          # Scroll-triggered fade animation
        │   ├── Reveal.jsx          # Scroll-triggered reveal animation
        │   └── *.css               # Component-scoped stylesheets
        │
        └── pages/                  # Route-level page components
            ├── Home.jsx            # Landing page
            ├── About.jsx           # About studio page
            ├── Portfolio.jsx       # Portfolio showcase
            ├── Gallery.jsx         # Photo gallery
            ├── Blog.jsx            # Blog listing
            ├── Contact.jsx         # Contact page
            └── *.css               # Page-scoped stylesheets
```

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

| Tool | Minimum Version | Download |
|---|---|---|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x or higher | Included with Node.js |
| **Go** | 1.21 or higher | [go.dev/dl](https://go.dev/dl/) |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |

Verify your installations:

```bash
node --version
npm --version
go version
git --version
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/captured-moments.git
cd captured-moments
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Build the Frontend

```bash
npm run build
```

This compiles the React application and outputs optimized static files to `frontend/dist/`.

### 4. Set Up the Backend

```bash
cd ../backend
go mod tidy
```

This downloads and verifies all Go module dependencies.

### 5. Start the Server

```bash
go run main.go
```

The application is now running at **[http://localhost:8080](http://localhost:8080)** 🎉

---

## 💻 Development

### Frontend Development Server

For active frontend development with hot module replacement (HMR):

```bash
cd frontend
npm run dev
```

Vite will start a dev server (typically at `http://localhost:5173`) with instant hot reloading.

### Linting

Run ESLint to check code quality:

```bash
cd frontend
npm run lint
```

### Preview Production Build

Preview the production build locally before deploying:

```bash
cd frontend
npm run preview
```

---

## 🚢 Production Build & Deployment

### Step-by-Step Production Setup

```bash
# 1. Build the frontend for production
cd frontend
npm ci
npm run build

# 2. Start the backend server
cd ../backend
go mod tidy
go build -o captured-moments-server .
./captured-moments-server
```

The compiled Go binary (`captured-moments-server`) serves both the API and the static frontend — no separate web server (Nginx, Apache) is required.

### Environment

| Variable | Default | Description |
|---|---|---|
| Port | `8080` | Server listening port |

---

## ⚙ Configuration

### Vite Configuration

The frontend build is configured in `frontend/vite.config.js`. The default setup uses the React plugin with no additional customization required.

### Backend Routing

The Go backend in `backend/main.go` handles three routing categories:

1. **`/assets/*`** — Serves compiled frontend assets from `frontend/dist/assets`
2. **`/api/*`** — REST API endpoints for dynamic data
3. **`/*` (catch-all)** — Serves `index.html` for all other routes, enabling React Router's client-side navigation

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "Add: description of your changes"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Code Style

- **Frontend**: Follow ESLint rules defined in `eslint.config.js`
- **Backend**: Follow standard Go formatting (`gofmt`)
- **CSS**: Use vanilla CSS with component-scoped files (no CSS-in-JS)

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Captured Moments** — *Crafting timeless memories, one frame at a time.*

</div>
