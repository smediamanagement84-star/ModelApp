# Hire The Glam

A premium talent management platform connecting agencies with models, photographers, and makeup artists.

## Features

- **Talent Discovery**: Browse professional models, photographers, and makeup artists
- **Category Filtering**: Filter by division (Women, Men, New Faces, etc.)
- **Professional Profiles**: Detailed profiles with stats, portfolios, and pricing
- **Agency Portal**: Secure login for agencies to access full talent information
- **Admin Dashboard**: Manage applications and approve new talent
- **Payment Integration**: eSewa and Khalti payment support (Nepal market)
- **Supabase Backend**: PostgreSQL database with real-time capabilities

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + Google OAuth)
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel / Netlify ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/smediamanagement84-star/ModelApp.git
cd ModelApp

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

> **Note**: The app works without Supabase configured, using mock data for development.

### Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)

2. Run the schema in SQL Editor:
   ```sql
   -- Copy contents of supabase/schema.sql
   ```

3. (Optional) Add sample data:
   ```sql
   -- Copy contents of supabase/seed.sql
   ```

4. Configure environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Enable Google OAuth (optional):
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── app/                    # Page components
│   ├── page.tsx           # Home page
│   ├── models/page.tsx    # Talent search
│   ├── login/page.tsx     # Authentication
│   ├── join/page.tsx      # Talent application
│   └── admin/page.tsx     # Admin dashboard
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── ModelCard.tsx
│   ├── ErrorBoundary.tsx
│   └── ...
├── lib/                   # Utilities and services
│   ├── supabase.ts       # Supabase client
│   ├── auth.tsx          # Auth context & hooks
│   ├── database.types.ts # TypeScript types
│   ├── hooks/            # Data fetching hooks
│   └── mockData.ts       # Fallback sample data
├── supabase/             # Database files
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
├── src/
│   └── index.css         # Global styles
├── types.ts              # App TypeScript types
├── App.tsx               # Main app component
└── index.tsx             # Entry point
```

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `talents` | Models, photographers, MUAs |
| `talent_stats` | Measurements, specialties |
| `talent_socials` | Social media links |
| `applications` | New talent applications |
| `unlocked_talents` | Paid profile access |

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes* | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes* | Supabase anonymous key |
| `GEMINI_API_KEY` | No | Gemini AI API key |
| `VITE_APP_URL` | No | Production URL |

*App works without these using mock data

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript checks |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary. All rights reserved.

---

Engineered by **GTdevS**
