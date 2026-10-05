# 🏰 EstateVista — Premier Luxury Real Estate Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-Platform-4285F4?logo=googlemaps)](https://developers.google.com/maps)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

**EstateVista** is a modern, high-performance luxury real estate web application built for browsing, managing, and discovering high-end residential and commercial properties across India's prime metropolitan hubs (Hyderabad, Bangalore, Mumbai, Pune, and Chennai).

---

## ✨ Key Features

### 🔐 1. Firebase Authentication & Role-Based Access Control (RBAC)
- **User Roles**: `USER` (Client/Buyer), `AGENT` (Advisor), `ADMIN` (Platform Manager).
- **Secure Auth**: Email/password registration, login, logout, password reset, and auth state persistence.
- **Role Protection**: Server-side and client-side route guards (`RoleGuard`) restricting dashboard portals (`/admin`, `/agent`).
- **Profile Synchronization**: Automatic sync with Firestore `users/{uid}` profiles. Default registration role is strictly enforced as `'user'`.

### 🗺️ 2. Google Maps Platform Integration
- **Interactive Property Maps**: Powered by `@googlemaps/js-api-loader` with custom price markers, zoom/pan controls, and property preview popups.
- **Headquarters Location**: Live Google Location Map on `/contact` for EstateVista Financial District Hub (Gachibowli, Hyderabad).
- **Dynamic Open Directions**: Direct navigation link (`https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`) for every property.
- **Graceful Key Fallback**: Styled fallback card with address and directions if API key is unconfigured.

### 🏢 3. Real Estate Management & Inquiries
- **Property Listings**: Filterable by city, property type, price range, bedrooms, and listing type (Sale/Rent).
- **Contact & Inquiries**: Form submission hooked directly to Firestore `inquiries` and `leads` collections with instant confirmation.
- **Favorites System**: Save and toggle favorite properties per user synced with Firestore `users/{uid}/favorites`.
- **Showcase Demo Mode**: Automatic fallback to rich seed properties (`SEED_PROPERTIES`) if Firestore is empty, ensuring the application is always populated.

### 🛡️ 4. Enterprise Security & Architecture
- **Environment Isolation**: Secret API keys kept out of source code via `.env.local` and ignored by Git.
- **Firestore Security Rules**: Strict role validation in `firestore.rules`.
- **Zero Build Warnings**: 100% TypeScript type safety across all 24 static and dynamic App Router routes.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework & Server-Side Rendering |
| **React 19** | UI Library & Components |
| **TypeScript** | Type Safety |
| **Tailwind CSS v4** | Styling & Visual Identity |
| **Firebase Auth & Firestore** | Authentication & Real-Time Database |
| **Google Maps JS API** | Interactive Location Maps & Markers |
| **Cloudinary** | Media Upload & Asset Storage |
| **Lucide React** | Icons & Visual Elements |
| **Canvas Confetti** | Interactive Submission Animation |

---

## 📁 Project Architecture

```text
EstateVista/
├── app/
│   ├── about/            # Company overview & advisory values
│   ├── admin/            # Admin Dashboard, Property & User Management
│   ├── agent/            # Agent Portal & Lead Tracking
│   ├── contact/          # Contact Form & Interactive HQ Map
│   ├── enquiries/        # User Inquiry Tracking
│   ├── favorites/        # Saved Property Collection
│   ├── locations/        # Metropolitan Hubs & National Map View
│   ├── login/            # Authentication Portal
│   ├── profile/          # User Account Management
│   ├── properties/       # Property Listings & Details ([slug])
│   ├── register/         # User Signup Portal
│   └── visits/           # Viewing Appointments
├── components/
│   ├── auth/             # RoleGuard & Protection Components
│   ├── common/           # Navigation Bar & Footer
│   ├── map/              # GoogleLocationMap & PropertyMap
│   ├── properties/       # PropertyCard & Grid Views
│   └── ui/               # Reusable UI Atoms
├── data/
│   └── seed/             # Showcase Seed Properties, Agents, & Cities
├── lib/
│   ├── auth/             # AuthContext & State Provider
│   ├── firebase/         # Modular Firebase Auth, Users, Properties, Inquiries
│   └── maps/             # Singleton Google Maps API Loader
├── types/                # TypeScript Interfaces (Property, User, Lead)
└── firestore.rules       # Security & Role Access Rules
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### 2. Installation
```bash
git clone https://github.com/adiseshu143/EstateVista.git
cd EstateVista
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the project root:

```env
# Client-Side Firebase Keys
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your-app-id:web:abcdef

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Showcase Demo Fallback
NEXT_PUBLIC_ENABLE_DEMO_DATA=true

# Cloudinary Upload Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=estatevista_preset
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security Rules & Roles

| Role | Access Level |
| :--- | :--- |
| **USER** | Browse listings, view maps, save favorites, submit contact form, view own inquiries. |
| **AGENT** | Everything a USER can do + access `/agent/dashboard`, manage assigned properties. |
| **ADMIN** | Full access to `/admin/*`, manage users, assign agents, create/edit/delete properties, view all leads. |

---

## 📄 License
This project is private and proprietary to EstateVista.
