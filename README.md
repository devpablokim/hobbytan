# HOBBYTAN AI Website

HOBBYTAN AI official website. AI Power Workshop and consulting service introduction.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Database**: Firebase Firestore
- **Email**: Nodemailer (Gmail SMTP)
- **Hosting**: Firebase Hosting (Asia Northeast 3)

## Features

### Main Website (`/`)
- Service introduction landing page
- Hero section with animated elements
- Problem & solution presentation
- Curriculum overview
- Why Hobbytan section
- Services offered
- Success stories
- Pricing information
- CTA (Call to Action) section

### Contact Form (`/contact`)
- Contact inquiry form with validation
- Honeypot spam protection (hidden field to detect bots)
- Required fields: name, email, phone, message
- Optional field: company/organization
- Confirmation email to inquirer
- Notification email to admin

### Admin Dashboard (`/admin`)
- Inquiry management interface
- List view with status badges (new/read/replied)
- Detailed inquiry view
- One-click email reply and call actions
- Real-time refresh capability

### Super Workshop MVP (`/super-wks/`) - Separate App
- Workshop participant management system
- See [super-wks/README.md](./super-wks/README.md) for details

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@hobbytan.com
```

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Extract `project_id`, `client_email`, and `private_key` for environment variables

### Gmail SMTP Setup
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password at [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the generated password as `SMTP_PASSWORD`

## Deployment

### Firebase Hosting

```bash
# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy
```

### Configuration
The `firebase.json` configures:
- **Site**: hobbytan-ai
- **Region**: asia-northeast3 (Seoul)
- **Runtime**: Node.js 20

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main landing page
│   │   ├── layout.tsx            # Root layout with fonts
│   │   ├── globals.css           # Global styles
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact form page
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin dashboard
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts      # Contact API (POST/GET)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   └── Footer.tsx        # Site footer
│   │   ├── sections/
│   │   │   ├── Hero.tsx          # Hero banner
│   │   │   ├── Problem.tsx       # Problem statement
│   │   │   ├── WhyNow.tsx        # Why now section
│   │   │   ├── Services.tsx      # Services offered
│   │   │   ├── Curriculum.tsx    # Curriculum overview
│   │   │   ├── WhyHobbytan.tsx   # Why choose us
│   │   │   ├── Success.tsx       # Success stories
│   │   │   ├── Pricing.tsx       # Pricing plans
│   │   │   └── CTA.tsx           # Call to action
│   │   └── ui/
│   │       ├── button.tsx        # Button component
│   │       └── card.tsx          # Card component
│   └── lib/
│       ├── firebase-admin.ts     # Firebase Admin SDK
│       ├── hooks.ts              # Custom React hooks
│       └── utils.ts              # Utility functions
├── public/
│   └── logo-white.svg            # Logo assets
├── super-wks/                    # Super Workshop MVP (separate Vite app)
├── firebase.json                 # Firebase configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## API Endpoints

### POST `/api/contact`
Submit a contact inquiry.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "company": "string (optional)",
  "message": "string (required)",
  "website": "string (honeypot - should be empty)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "id": "firestore-document-id"
}
```

### GET `/api/contact`
Retrieve all inquiries (admin use).

**Response:**
```json
{
  "inquiries": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "message": "string",
      "createdAt": "ISO string",
      "status": "new | read | replied"
    }
  ]
}
```

## Firestore Collections

### `inquiries`
Stores contact form submissions.

```
{
  name: string,
  email: string,
  phone: string,
  company: string (optional),
  message: string,
  createdAt: string (ISO),
  status: "new" | "read" | "replied"
}
```

## License

Copyright 2024-2026 HOBBYTAN AI. All rights reserved.
