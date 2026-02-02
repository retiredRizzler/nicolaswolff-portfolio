# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern portfolio website for professional photographer Nicolas Wolff, built with Nuxt 4 and Nuxt UI. The site features smooth animations, storytelling-driven layouts, and showcases photography work across multiple categories (Reportage, Corporate, Portrait, Product).

## Key Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm install              # Install dependencies
npm run postinstall      # Prepare Nuxt (runs automatically after install)

# Production
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run generate         # Generate static site
```

## Architecture

### Tech Stack
- **Framework**: Nuxt 4 with Vue 3
- **UI Library**: Nuxt UI (Tailwind CSS v4 based)
- **Animations**: GSAP for complex timeline-based animations
- **TypeScript**: Enabled via Nuxt's auto-generated tsconfig

### Project Structure

```
app/
├── app.vue                           # Root component with page transitions
├── pages/
│   ├── index.vue                     # Landing page (Hero + Cinematic Scroll + About + CTA)
│   ├── work/
│   │   └── [slug].vue               # Dynamic project detail pages (Editorial Story style)
│   └── variations.vue                # Style variations preview (for design decisions)
├── components/
│   ├── LoaderLanding.vue            # Hero landing animation component
│   └── sections/
│       ├── CinematicScroll.vue      # Full-screen parallax project showcase
│       ├── EditorialStory.vue       # Magazine-style editorial layout
│       └── InteractiveGallery.vue   # Horizontal scroll gallery
├── composables/
│   └── useProjects.ts               # Project data management composable
├── assets/
│   └── css/
│       └── main.css                 # Global styles + transitions
public/
├── images/                           # Static photography assets
└── favicon.ico
```

### Configuration
- `nuxt.config.ts`: Nuxt configuration with @nuxt/ui module enabled
- `tsconfig.json`: Uses Nuxt's generated TypeScript configs via project references
- CSS imports are configured in `app/assets/css/main.css` with Tailwind CSS v4 and Nuxt UI

## Design System & Animation Patterns

### Landing Animation Component
The `LoaderLanding.vue` component demonstrates the animation architecture:

**GSAP Timeline Pattern**: Complex multi-phase animations are orchestrated using GSAP timelines with the following structure:
1. Letter stagger animations with `yPercent` transforms
2. Width-based box expansion effects
3. Image growth animations synced with text
4. Fullscreen explosion effects using viewport units
5. Sequential reveal of content with stagger delays

**Component Props Pattern**: The loader is fully configurable via props:
- `title`, `socialLinks`, `services`: Content customization
- `images`, `mainImage`: Image assets
- `autoPlay`: Animation control
- Emits `@complete` event when animation finishes

**Lifecycle Management**:
- Animations init in `onMounted`
- Timeline cleanup in `onBeforeUnmount` to prevent memory leaks
- `defineExpose` used to allow manual playback control

### Styling Approach
- **Scoped Styles**: Component styles are scoped with custom CSS (not purely Tailwind utilities)
- **Custom Font**: PP Neue Montreal loaded via @font-face
- **Responsive**: Mobile-first with breakpoints at 767px and 991px
- **Custom Cursors**: SVG cursor URLs for default and pointer states
- **Dark Text on Light**: Primary color scheme is `#201d1d` on `#f4f4f4`

## Portfolio Content Strategy

Based on the current site analysis, the portfolio should feature:

**Photography Categories**:
- Reportage (documentary/editorial)
- Corporate (business/professional)
- Portrait (individual/group)
- Product (food, commercial items)

**Case Study Structure**: Each project should include:
- Client name (e.g., @ADEUX, @Sweetsbydagi)
- Project type/category
- Location and date metadata
- Image galleries
- Project narrative/story

**Sample Projects**:
- Food/burger photography (Beersel 2025)
- Confection photography (Zaventem 2025)
- Travel documentary (Thailand)

## Development Guidelines

### When Creating New Pages/Routes
- Use Nuxt's file-based routing in `app/pages/` directory
- Follow the dark text on light background color scheme (#201d1d / #f4f4f4)
- Implement smooth transitions using GSAP patterns established in LoaderLanding
- Use Nuxt UI components for consistent design system

### When Adding Images
- Place static images in `public/images/`
- Use descriptive filenames (e.g., `nico-background-hero.jpeg`)
- Consider lazy loading with `loading="lazy"` attribute
- Implement blur-up effects for better perceived performance

### When Working with Animations
- Use GSAP for complex timeline animations
- Follow the pattern: timeline creation → phase sequencing → cleanup on unmount
- Use `expo.inOut` or `expo.out` easing for smooth, professional feel
- Leverage position parameters (`<`, `>`, `-=`, etc.) for precise timing

### Component Development
- Use Vue 3 Composition API with `<script setup>`
- Emit events for parent communication (e.g., animation completion)
- Make components reusable via props with sensible defaults
- Expose methods via `defineExpose` when manual control is needed

## Routing & Data Management

### Dynamic Routes
- Project detail pages use Nuxt's file-based routing: `/work/[slug].vue`
- Slugs are defined in the `useProjects` composable
- Each project has a unique slug for SEO-friendly URLs

### Composables
- **useProjects**: Centralized project data management
  - `getProjects()`: Returns all projects
  - `getProjectBySlug(slug)`: Returns single project by slug
  - `getFeaturedProjects()`: Returns featured projects for homepage

### Navigation Flow
1. **Landing Page** (`/`): Hero animation → Cinematic Scroll (My Work) → About → CTA
2. **Click on work item**: Navigates to `/work/{slug}`
3. **Project Detail Page**: Editorial Story layout with hero, multiple sections, and back navigation
4. **Page Transitions**: Smooth fade + slide transitions between pages

## Page Structure

### Landing Page (index.vue)
- **LoaderLanding**: Animated hero with photographer name and subtitle
- **CinematicScroll**: Full-screen parallax sections for each project (clickable)
- **About Section**: Two-column layout with bio and stats
- **CTA Section**: Contact call-to-action

### Project Detail Page ([slug].vue)
- **Hero Section**: Full-screen image with project title, client, metadata
- **Editorial Section 1**: Large image left, story text right (with number "01")
- **Full-width Break**: Immersive full-screen image
- **Editorial Section 2**: Reversed layout with challenge text
- **Solution Section**: Dark background with centered solution text
- **Tags Section**: Project tags as outlined badges
- **Next Project CTA**: Link back to homepage

## Important Notes

- **No Git Repository**: This project is not currently under version control
- **Nuxt Auto-Imports**: Components, composables, and utilities are auto-imported by Nuxt
- **TypeScript**: Configuration is managed by Nuxt's generated configs in `.nuxt/` directory
- **Tailwind v4**: Uses new CSS-first import syntax (`@import "tailwindcss"`)
- **Page Transitions**: Defined globally in `app.vue` and `main.css`
