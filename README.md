# Ravono Vendor Compliance - Frontend-Only Application

This is a **frontend-only** version of the Ravono Vendor Compliance SaaS platform, converted from a full-stack Next.js application to a static site using mock data.

## Overview

The application has been converted to operate entirely on the client-side with:
- **No backend API** - All API calls replaced with mock services
- **Client-side authentication** - Using `localStorage` for session management
- **Mock data layer** - Static JSON data for users, verifications, and reports
- **Static site export** - Configured for `output: "export"` in Next.js

## Tech Stack

- **Framework**: Next.js 15.3.0 (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Framer Motion, Iconify
- **Mock Data**: Local JSON files + localStorage

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── components/               # Reusable UI components
│   ├── dashboard/                # Dashboard pages (verify, reports, billing, etc.)
│   ├── auth/                     # Authentication pages (sign-in, sign-up)
│   ├── admin/                    # Admin panel pages
│   └── layout.tsx                # Root layout with mock AuthProvider
├── lib/
│   ├── mock/
│   │   ├── data.ts               # Mock data (users, verifications, reports)
│   │   └── service.ts            # Mock service layer (simulates API calls)
│   └── auth/
│       └── mock-client.tsx       # Client-side auth provider & hooks
└── next.config.ts                # Next.js config (static export enabled)
```

## Mock Service Layer

### Authentication (`lib/auth/mock-client.tsx`)
- `useAuth()` hook provides: `user`, `loading`, `isAuthenticated`, `login()`, `logout()`
- Session stored in `localStorage`
- Mock users defined in `lib/mock/data.ts`

### API Services (`lib/mock/service.ts`)
- `mockService.auth.login(email)` - Simulates login
- `mockService.auth.logout()` - Clears session
- `mockService.auth.getSession()` - Retrieves current user
- `mockService.verifications.list()` - Returns mock verifications
- `mockService.verifications.create(type, payload)` - Simulates verification creation
- `mockService.files.upload(file)` - Simulates file upload

All mock services include a 500ms simulated latency for realistic UX.

## Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

3. **Build for production**:
   ```bash
   npm run build
   ```
   This generates a static site in the `out/` directory.

4. **Preview production build**:
   ```bash
   npm run start
   ```

## Mock Users

The following mock users are available (defined in `lib/mock/data.ts`):

| Email | Role | Credits |
|-------|------|---------|
| admin@example.com | admin | 1000 |
| manager@example.com | manager | 500 |
| user@example.com | user | 100 |

**Note**: Any email can be used for login in the mock system - it will default to the "user" role if not found in `MOCK_USERS`.

## Features

### ✅ Implemented (Mock)
- User authentication (client-side)
- Dashboard with verification pages (GST, PAN, Aadhaar)
- Reports page
- Billing page (mock subscription data)
- Admin panel
- File upload simulation
- Protected routes
- Role-based access control

### ❌ Removed
- All backend API routes (`app/api/*`)
- Database integration (`lib/db/*`)
- Server middleware (`middleware.ts`)
- External dependencies: `cosmic-authentication`, `cosmic-database`, `cosmic-payments`, `stripe`, `firebase`

## Development Notes

### Known Limitations
1. **No data persistence** - All data resets on page refresh (except `localStorage` session)
2. **No real verification** - All verification requests return mock success responses
3. **No payment processing** - Billing page shows mock subscription data
4. **No file storage** - File uploads return mock local URLs
5. **ESLint disabled during builds** - Set in `next.config.ts` to bypass lint errors during static export

### Configuration
- **Static Export**: `next.config.ts` has `output: "export"`
- **ESLint**: Disabled during builds (`ignoreDuringBuilds: true`)
- **Images**: Unoptimized for static export compatibility

## Deployment

Since this is a static site, it can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Deploy the `out/` directory
- **GitHub Pages**: Deploy the `out/` directory
- **AWS S3 + CloudFront**: Upload `out/` to S3 bucket

## Troubleshooting

### Build Errors
If you encounter build errors:
1. Check that all `cosmic-*` imports have been removed
2. Ensure all components use `@/lib/auth/mock-client` instead of `cosmic-authentication`
3. Verify `next.config.ts` has `output: "export"` and `eslint.ignoreDuringBuilds: true`

### Runtime Errors
- Check browser console for errors
- Verify `localStorage` is available (required for auth)
- Ensure mock data is properly imported in components

## Future Enhancements

To convert this back to a full-stack application:
1. Restore backend API routes in `app/api/`
2. Replace `mockService` calls with real `fetch()` calls
3. Implement real database integration
4. Add server-side authentication
5. Remove `output: "export"` from `next.config.ts`
6. Re-enable ESLint

## License

[Your License Here]

## Support

For questions or issues, please contact [your-email@example.com]
