# Prompt Manager - Frontend

A modern Next.js application for managing AI prompts and projects with multiple AI providers.

## Features

- **Authentication**: Google OAuth integration with Firebase
- **Project Management**: Create, view, and delete AI prompt projects
- **Multi-Provider Support**: Support for OpenAI, Anthropic, and Google AI models
- **Real-time State Management**: Global state management with React Context
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth with Google OAuth
- **HTTP Client**: Axios with cookie-based sessions
- **State Management**: React Context with useReducer
- **Language**: TypeScript

## Architecture

### API Integration

The application integrates with the following backend endpoints:

#### Authentication
- `POST /auth/login` - User login with Firebase token
- `POST /auth/logout` - User logout

#### Projects
- `POST /api/projects` - List, create projects
- `POST /api/projects/{id}` - Delete specific project

#### Models
- `POST /api/config` - Fetch available AI models

### State Management

The application uses a layered state management approach:

1. **AuthContext**: Manages user authentication state
2. **AppContext**: Manages application data (projects, models)
3. **Custom Hooks**: Provide convenient API interaction methods
   - `useProjects()` - Project CRUD operations
   - `useModels()` - Model fetching
   - `useAuth()` - Authentication state

### Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout with providers
├── components/           # Reusable UI components
│   ├── Header.tsx        # App header with logout
│   ├── ProjectCard.tsx   # Project display component
│   └── CreateProjectModal.tsx # Project creation modal
├── contexts/            # React contexts for state management
│   ├── AuthContext.tsx  # Authentication state
│   └── AppContext.tsx   # Application data state
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication utilities
│   ├── useProjects.ts   # Project management
│   └── useModels.ts     # Model fetching
└── lib/                 # Utility libraries
    ├── api.ts           # API client and types
    └── firebase.ts      # Firebase configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Google Auth enabled
- Backend API server running

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Firebase Setup

1. Create a Firebase project
2. Enable Google Authentication
3. Add your domain to authorized domains
4. Copy the Firebase config to your environment variables

## API Integration

### Authentication Flow

1. User clicks "Continue with Google"
2. Firebase handles Google OAuth
3. Frontend receives Firebase ID token
4. Token is sent to backend `/auth/login` endpoint
5. Backend validates token and creates session
6. User is redirected to dashboard

### Project Management

- **Create Project**: Select models, add description, optionally add API keys
- **View Projects**: Display all user projects with model information
- **Delete Project**: Remove project with confirmation

### Error Handling

- Global error handling for API calls
- User-friendly error messages
- Loading states for all async operations
- Proper fallbacks for network issues

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Ensure environment variables are set in production

## Contributing

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Update documentation for significant changes
4. Test authentication flow after changes

## License

This project is part of the Prompt Manager application suite.
