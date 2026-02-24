# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-02-24

### Added
- **Super Workshop MVP** (`/super-wks/`)
  - Separate Vite + React + TypeScript application for workshop management
  - Role-based access control (admin, team_lead, student)
  - Dashboard with cohort statistics and team progress tracking
  - Curriculum management with weekly learning materials
  - Team detail pages with member progress
  - Assignment submission system (file, text, link types)
  - Community board with posts and comments
  - Admin panel for managing cohorts, teams, and users
  - Firebase Authentication integration
  - Firestore data schema for workshop data
  - Mock data for development and testing

### Technical
- React 19 with TypeScript
- Vite 7 build system
- Tailwind CSS 4 styling
- React Router 7 for navigation
- Firebase SDK 12 for auth and data

## [0.2.0] - 2026-02-20

### Added
- **Contact Form** (`/contact`)
  - Form validation for required fields (name, email, phone, message)
  - Optional company/organization field
  - Honeypot spam protection mechanism
  - Responsive two-column layout
  - Success confirmation screen

- **Email Notification System**
  - Automatic email to admin on new inquiry
  - Confirmation email to inquirer
  - Professional HTML email templates
  - Gmail SMTP integration via Nodemailer

- **Admin Dashboard** (`/admin`)
  - Inquiry list with pagination
  - Status badges (new, read, replied)
  - Detailed inquiry view panel
  - Quick action buttons (email reply, call)
  - Real-time data refresh

### Changed
- Updated README with new features and environment variables
- Added Firebase Admin SDK for server-side operations

### Technical
- Firebase Firestore for inquiry storage
- Nodemailer for email delivery
- Server-side API routes for form handling

## [0.1.0] - 2026-01-23

### Added
- **Landing Page** (`/`)
  - Hero section with animated elements
  - Problem statement section
  - "Why Now" section explaining AI timing
  - Services overview
  - 5-week curriculum display
  - "Why Hobbytan" differentiators
  - Success stories carousel
  - Pricing plans
  - Call-to-action section
  - Responsive header with navigation
  - Footer with company information

### Technical
- Next.js 14 framework setup
- Tailwind CSS configuration
- Framer Motion animations
- shadcn/ui component library
- TypeScript configuration
- ESLint setup
- Firebase Hosting configuration

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 0.3.0 | 2026-02-24 | Super Workshop MVP with full CRUD |
| 0.2.0 | 2026-02-20 | Contact form, email system, admin dashboard |
| 0.1.0 | 2026-01-23 | Initial landing page release |
