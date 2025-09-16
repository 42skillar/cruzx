# Overview

Cruzz is a blood donor management system built for Cruz Vermelha Angola (Angola Red Cross). It's a Next.js-based web application designed to manage blood donors, donations, and related administrative operations across Angola's provinces. The system supports offline functionality for areas with limited connectivity and includes Progressive Web App (PWA) capabilities for mobile usage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 13+ with App Router, TypeScript support
- **Styling**: Tailwind CSS with CSS variables for theming, shadcn/ui component library
- **State Management**: React hooks with Context API for authentication and global state
- **UI Components**: Radix UI primitives with custom styling through shadcn/ui
- **Progressive Web App**: Manifest configuration with service worker for offline functionality

## Backend Architecture
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with role-based access control (admin, leader, operator)
- **API Layer**: Supabase client-side SDK for database operations
- **File Storage**: Supabase Storage for any file uploads
- **Real-time Features**: Supabase real-time subscriptions for live updates

## Data Storage Solutions
- **Primary Database**: Supabase PostgreSQL with tables for profiles, provinces, donors, and donations
- **Offline Storage**: IndexedDB for storing pending data when offline
- **Session Management**: Supabase handles authentication sessions and JWT tokens
- **Caching Strategy**: Browser cache with service worker for static assets and API responses

## Authentication and Authorization
- **Authentication Provider**: Supabase Auth with email/password authentication
- **Role-based Access**: Three user roles (admin, leader, operator) with different permissions
- **Province-based Access**: Users are assigned to specific provinces for data access control
- **First Login Flow**: Password change requirement for new users
- **Session Management**: Automatic session refresh and logout handling

## Offline Functionality
- **Service Worker**: Custom service worker for caching and offline support
- **IndexedDB Integration**: Local storage for donor and donation data when offline
- **Sync Manager**: Automatic synchronization of offline data when connection is restored
- **Offline Indicators**: UI components showing online/offline status and pending sync count

## External Dependencies

### Core Services
- **Supabase**: Primary backend service providing database, authentication, and real-time features
- **Google Apps Script**: Email service integration for sending provisional passwords and notifications

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible UI component primitives
- **shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library for UI components

### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Static type checking for better code quality
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation and formatting utilities

### PWA Features
- **Service Worker**: Custom implementation for offline caching
- **Web App Manifest**: PWA configuration for mobile app-like experience
- **IndexedDB**: Browser storage for offline data persistence

### Additional Libraries
- **Embla Carousel**: Carousel/slider components
- **CMDK**: Command palette implementation
- **Class Variance Authority**: Utility for component variant management
- **Recharts**: Chart library for data visualization (configured but not extensively used)