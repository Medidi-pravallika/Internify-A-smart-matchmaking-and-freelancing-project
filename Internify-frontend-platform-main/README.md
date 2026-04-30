# Internify - Smart Internship & Freelance Matchmaking Platform (Frontend)

A modern, responsive React frontend for the Internify platform that connects students with internship and freelance opportunities using AI-powered matching.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Authentication**: JWT-based with localStorage

## Features

### Authentication
- Student and Recruiter registration
- Secure login with JWT tokens
- Role-based access control
- Automatic token expiry handling

### Student Dashboard
- **Profile Management**: Update personal details, skills, and upload resume
- **Browse Opportunities**: Search and filter internships and freelance gigs
- **Apply**: One-click application to opportunities
- **Track Applications**: Monitor application status (Pending/Accepted/Rejected)
- **AI Recommendations**: Upload resume for smart opportunity matching
- **Submit Reviews**: Rate and review recruiters after completion

### Recruiter Dashboard
- **Profile Management**: Update organization details
- **Post Opportunities**: Create internship and freelance postings with JD upload
- **Manage Opportunities**: Update status and delete postings
- **View Applicants**: Review and manage applications (Accept/Reject)
- **ML Resume Matching**: Upload JD to find best matching students
- **Submit Reviews**: Rate and review students

### Admin Dashboard
- **User Management**: View and delete users
- **Internship Management**: Review and moderate pending internships
- **Review Moderation**: View and delete inappropriate reviews
- **Analytics**: Platform statistics and insights

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Footer.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── Sidebar.tsx
│   └── Toast.tsx
├── dashboards/          # Role-based dashboards
│   ├── admin/
│   ├── recruiter/
│   └── student/
├── hooks/               # Custom React hooks
│   └── useToast.ts
├── pages/               # Public pages
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   └── Signup.tsx
├── services/            # API service layer
│   ├── admin.service.ts
│   ├── api.ts
│   ├── auth.service.ts
│   ├── recruiter.service.ts
│   └── student.service.ts
├── types/               # TypeScript types
│   └── index.ts
├── App.tsx              # Main app with routing
└── main.tsx             # App entry point
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Spring Boot backend running (see backend repo)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd internify-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```
VITE_API_BASE_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## API Integration

The frontend connects to the Spring Boot backend via REST APIs. All API calls include JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Key API Endpoints

**Authentication**
- POST `/api/auth/login` - User login
- POST `/api/auth/register/student` - Student registration
- POST `/api/auth/register/recruiter` - Recruiter registration

**Student**
- GET `/api/students/me` - Get profile
- PUT `/api/students/me` - Update profile
- GET `/api/students/internships` - Browse internships
- POST `/api/students/internships/{id}/apply` - Apply to internship
- GET `/api/students/applications` - Get my applications
- POST `/api/match/student` - Get AI recommendations

**Recruiter**
- GET `/api/recruiters/me` - Get profile
- POST `/api/recruiters/internships` - Create internship
- GET `/api/recruiters/internships/{id}/applications` - Get applicants
- PUT `/api/recruiters/applications/{id}/status` - Accept/Reject application
- POST `/api/match/recruiter` - Get matched students

**Admin**
- GET `/api/admin/users` - Get all users
- DELETE `/api/admin/users/{id}` - Delete user
- GET `/api/admin/internships/pending` - Get pending internships
- GET `/api/admin/analytics` - Get platform analytics

## Key Features Implementation

### Role-Based Routing
Protected routes ensure users can only access their authorized dashboards:
```typescript
<ProtectedRoute allowedRoles={['STUDENT']}>
  <StudentDashboard />
</ProtectedRoute>
```

### Automatic Token Management
API interceptor automatically adds JWT token to requests and handles 401 errors:
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Toast Notifications
User-friendly feedback for all actions using custom toast hook:
```typescript
const { toast, showToast, hideToast } = useToast();
showToast('Action successful!', 'success');
```

### Responsive Design
Tailwind CSS classes ensure mobile-first responsive design:
- Mobile: Single column layouts
- Tablet: 2-column grids
- Desktop: 3-4 column grids with sidebar

## Design Principles

- **Clean UI**: Modern, professional design with consistent spacing
- **User Feedback**: Loading states, toast notifications, and error handling
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized bundle size and lazy loading
- **Type Safety**: Full TypeScript coverage for better DX

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:8080 |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all types are correct (`npm run build`)
4. Test thoroughly
5. Submit a pull request

## License

MIT License
