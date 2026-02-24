# Super Workshop MVP

Workshop participant management system for HOBBYTAN AI Power Workshop program.

## Overview

Super Workshop is a learning management system designed to track cohort-based workshop progress. It supports multiple user roles, team-based learning, assignment submissions, and community engagement.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Backend**: Firebase (Auth + Firestore)
- **State**: React Hooks + Context

## Features

### User Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Full access: manage cohorts, teams, users, curriculum, view all data |
| **Team Lead** | View team progress, member status, provide feedback |
| **Student** | View personal progress, submit assignments, participate in community |

### Pages

#### Dashboard (`/dashboard`)
- **Admin View**: Cohort selector, team count, student count, current week overview, team progress cards
- **Team Lead View**: Team summary, member-by-member progress table
- **Student View**: Personal progress, team progress, submissions with feedback, upcoming assignments

#### Curriculum (`/curriculum`)
- Weekly curriculum display (Week 0-5)
- Learning objectives and descriptions
- Study materials (video, doc, link)
- Assignment details with due dates

#### Team Detail (`/team/:id`)
- Team information and current week
- Member list with individual progress
- Weekly completion rates

#### Submit (`/submit`)
- Assignment submission form
- Support for file, text, and link submissions
- Week and assignment selection

#### Community (`/community`)
- Post creation and viewing
- Comments and discussions
- Team-specific or cohort-wide posts

#### Admin (`/admin`) - Admin only
- User management
- Cohort management
- Team assignment

## Development

```bash
# Navigate to super-wks directory
cd super-wks

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the `super-wks` directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Project Structure

```
super-wks/
├── src/
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   ├── components/
│   │   ├── Layout.tsx          # App shell with navigation
│   │   ├── Modal.tsx           # Reusable modal component
│   │   ├── ProgressBar.tsx     # Progress indicator
│   │   ├── WeekBadge.tsx       # Week status badge
│   │   ├── EmptyState.tsx      # Empty content placeholder
│   │   └── LoadingSkeleton.tsx # Loading placeholder
│   ├── pages/
│   │   ├── LoginPage.tsx       # Authentication
│   │   ├── DashboardPage.tsx   # Main dashboard (role-based)
│   │   ├── CurriculumPage.tsx  # Weekly curriculum
│   │   ├── TeamDetailPage.tsx  # Team information
│   │   ├── SubmitPage.tsx      # Assignment submission
│   │   ├── CommunityPage.tsx   # Discussion board
│   │   └── AdminPage.tsx       # Admin management
│   ├── hooks/
│   │   └── useAuth.ts          # Authentication hook
│   ├── services/
│   │   ├── authService.ts      # Firebase Auth operations
│   │   └── dataService.ts      # Firestore CRUD operations
│   ├── data/
│   │   └── mockData.ts         # Development mock data
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── lib/
│       └── firebase.ts         # Firebase configuration
├── public/
│   └── vite.svg                # Favicon
├── package.json
├── tsconfig.json
├── vite.config.ts
└── SCHEMA.md                   # Firestore schema documentation
```

## Data Model

See [SCHEMA.md](./SCHEMA.md) for complete Firestore schema documentation.

### Key Collections

| Collection | Purpose |
|------------|---------|
| `/cohorts` | Batch/cohort management |
| `/curriculum` | Weekly learning content |
| `/teams` | Team groupings |
| `/users` | User profiles and progress |
| `/submissions` | Assignment submissions |
| `/posts` | Community posts |

### Type Definitions

```typescript
type Role = 'admin' | 'team_lead' | 'student';
type WeekStatus = 'not-started' | 'in-progress' | 'completed';
type AssignmentType = 'file' | 'text' | 'link';
```

## URL Configuration

The app is configured to run at `/superworkshop` base path:

```typescript
<BrowserRouter basename="/superworkshop">
```

## Integration with Main Site

This is a standalone Vite application separate from the main Next.js site. Deployment options:

1. **Subdirectory**: Build and copy to main site's `/public/superworkshop/`
2. **Subdomain**: Deploy to `workshop.hobbytan.ai`
3. **Firebase Hosting**: Configure multiple sites in `firebase.json`

## Mock Data

For development, the app uses mock data in `src/data/mockData.ts`:

- 1 cohort (3rd batch)
- 6 weeks of curriculum (Week 0-5)
- 3 teams with members
- Sample users across all roles
- Sample submissions with feedback
- Community posts

## Security Rules

Firestore security rules (see SCHEMA.md):

| Collection | Admin | Team Lead | Student |
|------------|-------|-----------|---------|
| cohorts | RW | R | R |
| curriculum | RW | R | R |
| teams | RW | R (own) | R (own) |
| users | RW | R (team) | RW (self) |
| submissions | RW | R (team) | RW (self) |
| posts | RW | RW | RW (own) |

## License

Copyright 2024-2026 HOBBYTAN AI. All rights reserved.
