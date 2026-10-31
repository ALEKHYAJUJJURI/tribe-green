# Tribe Green – Corporate Gifting Catalogue

A corporate gifting catalogue and enquiry management platform developed as part of the V Green Media practical assignment.

The platform allows users to explore corporate gifting products, filter products based on their preferences, view product details, and submit enquiries. It also includes an admin dashboard for managing customer enquiries.

## Features

### Website
- Responsive corporate gifting catalogue.
- Product browsing and product details.
- Category-based filtering.
- Occasion-based filtering.
- Budget filtering and product search.
- Enquiry submission form.
- Responsive design for desktop and mobile.

### Android Application
- Browse corporate gifting products.
- View product details.
- Explore products by category.
- Submit product enquiries.
- Connects to the same backend as the website.

### Admin Dashboard
- Secure admin login.
- View and manage customer enquiries.
- Update enquiry statuses:
  - New
  - Contacted
  - Converted
  - Lost
- Export enquiries as CSV.
- Admin logout and authentication.

## Technology Stack

| Component | Technologies |
|---|---|
| Website | React, Vite, TypeScript, Tailwind CSS |
| Mobile App | React Native, Expo, TypeScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, HTTP-only cookies |
| API | REST API |
| Deployment | Vercel, Render / [actual hosting provider] |

## Project Architecture

The website and Android application communicate with a shared backend API. The backend handles product data, enquiry submissions, admin authentication, and enquiry management using MongoDB.

Website ─────┐
             ├── Shared Backend API ── MongoDB
Android App ─┘

## Project Structure

```text
tribe-green/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── data/
│   ├── server.js
│   └── package.json
│
├── tribe-green-android/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── app.json
│
├── README.md
└── HANDOVER.md
```

*Note: Update the folder structure to match the actual repository.*

## Installation and Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and configure the required environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=your_website_url
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

### 2. Website Setup

```bash
cd frontend
npm install
```

Configure the backend API URL in the appropriate environment file.

Start the development server:

```bash
npm run dev
```

### 3. Android App Setup

```bash
cd tribe-green-android
npm install
```

Configure the backend API URL and required environment variables.

Start the Expo development server:

```bash
npx expo start
```

## API Functionality

The backend provides REST APIs for:

- Product listing and product details.
- Enquiry submission.
- Admin login and logout.
- Fetching customer enquiries.
- Updating enquiry status.
- Exporting enquiries as CSV.

## Security Notes

- Sensitive environment variables are excluded from version control.
- Admin authentication uses cookie-based authentication.
- Cross-origin requests are configured for the deployed website.
- Do not commit `.env` files or production credentials.

## Project Links

Refer to `HANDOVER.md` for deployment links, APK access, demo recording, and submission details.
