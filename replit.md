# CollegeFinder 2.0 - Modern AI-Powered University Recommendation Platform

## Project Overview
A completely revamped, modern AI-powered college recommendation platform featuring a beautiful React UI, robust Node.js/Express backend, and real-time university data powered by OpenAI's Responses API with web search capabilities.

## Architecture

### Technology Stack
- **Frontend**: React 19 + Vite + TypeScript
- **UI Framework**: TailwindCSS 4 + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: Zustand + TanStack Query
- **Backend**: Node.js + Express + TypeScript
- **Validation**: Zod schemas for all API endpoints
- **Authentication**: JWT with httpOnly cookies + bcrypt
- **AI Service**: OpenAI GPT-4o with Responses API + Web Search for real-time 2025 data
- **Database**: PostgreSQL + Prisma ORM (available)

### Project Structure
```
collegefinder/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui base components
│   │   │   ├── Layout.tsx
│   │   │   └── Navigation.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── QuestionnairePage.tsx
│   │   │   ├── RecommendationsPage.tsx
│   │   │   ├── ScholarshipsPage.tsx
│   │   │   ├── TimelinePage.tsx
│   │   │   ├── EssaysPage.tsx
│   │   │   ├── ForumsPage.tsx
│   │   │   ├── ComparisonPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── lib/            # Utilities and API client
│   │   │   ├── api.ts      # Axios instance with interceptors
│   │   │   └── utils.ts    # Helper functions
│   │   ├── App.tsx         # Main app with routing
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/                 # Express backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts     # Authentication endpoints
│   │   │   ├── recommendations.ts
│   │   │   ├── universities.ts  # Real-time university data
│   │   │   └── scholarships.ts  # Real-time scholarship data
│   │   ├── services/       # Business logic
│   │   │   ├── ai-service.ts
│   │   │   └── university-service.ts  # GPT + Web Search service
│   │   └── index.ts        # Server entry point
│   └── tsconfig.json
├── legacy/                 # Archived Flask application
└── package.json            # Root dependencies
```

## Key Features

### Implemented Features
1. **Modern Landing Page**: Professional hero with gradient backgrounds, animated statistics, feature showcase
2. **Multi-Step Questionnaire**: 3-step wizard with visual progress, smooth transitions, input validation
3. **AI-Powered Recommendations**: OpenAI GPT with web search for accurate 2025 university data
4. **Real-Time University Data**: Fetches current rankings, tuition, acceptance rates via GPT web search
5. **University Comparison**: Compare up to 4 universities side-by-side with real-time data
6. **Scholarship Finder**: Search real scholarships with live data, filtering, and bookmarking
7. **Application Timeline**: Kanban-style drag-and-drop board with deadline tracking
8. **Essay Assistant**: Full essay editor with Common App prompts, word count, writing tips
9. **Authentication System**: JWT-based auth with secure password hashing
10. **Professional UI**: Beautiful gradients, modern cards, polished interactions, mobile-responsive

### Real-Time Data Integration (NEW)
- **University Service**: Uses OpenAI Responses API with `web_search` tool
- **Live Rankings**: Fetches current QS/US News 2025 rankings
- **Current Tuition**: Real tuition data for international students
- **Application Deadlines**: Up-to-date Fall 2025 deadlines
- **Scholarship Database**: Real scholarships with verified information
- **Citations**: All data includes source citations for verification

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear session

### Recommendations
- `POST /api/recommendations/generate` - Generate personalized recommendations

### Universities (NEW)
- `GET /api/universities/search?q={query}` - Search universities with real-time data
- `GET /api/universities/popular` - Get top 20 popular universities
- `GET /api/universities/:name` - Get detailed university information

### Scholarships (NEW)
- `GET /api/scholarships/` - Get popular scholarships
- `GET /api/scholarships/search?q={query}&type={type}` - Search scholarships

### Health
- `GET /api/health` - Server health check

## Development Workflow

### Running the Application
```bash
# The application starts via proxy.ts
# Backend runs on port 3001
# Frontend runs on port 5001
# Proxy serves both on port 5000
```

### Environment Variables
Server requires:
- `OPENAI_API_KEY`: OpenAI API key for GPT + web search
- `JWT_SECRET`: Secret for JWT token signing
- `NODE_ENV`: development/production
- `CLIENT_URL`: Frontend URL for CORS

## Recent Changes (December 19, 2025)

### Real-Time Data Integration
- ✅ Created university-service.ts with OpenAI Responses API + web search
- ✅ Added /api/universities endpoints for real-time data
- ✅ Added /api/scholarships endpoints for real-time data
- ✅ Updated ComparisonPage to fetch live university data
- ✅ Updated ScholarshipsPage to fetch live scholarship data
- ✅ All mock/placeholder data replaced with API calls

### Professional UI Overhaul
- ✅ Redesigned HomePage with modern hero, stats, and CTAs
- ✅ Updated Navigation with gradient branding and mobile menu
- ✅ Polished QuestionnairePage with visual step indicators
- ✅ Enhanced RecommendationsPage with match type badges and details
- ✅ Improved TimelinePage with deadline alerts and better drag-drop
- ✅ Refined EssaysPage with prompt selection and writing tips
- ✅ Professional color scheme with blue-purple gradients throughout

### Data Caching
- 24-hour cache for university and scholarship data
- Reduces API calls and improves response times

## User Preferences
- Focus on modern, professional UI
- Real-time, accurate 2025 university information
- Meaningful design with every element serving a purpose
- Student-centric features for the application process
