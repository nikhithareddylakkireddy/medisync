# MediSync Book - Doctor Appointment Booking Platform

A modern, full-stack doctor appointment booking platform built with React, Express, and Firebase.

## 🚀 Features

- **Google Authentication**: Secure sign-in for patients and administrators.
- **Doctor Discovery**: Search and filter doctors by specialization, state, district, and city.
- **Real-time Booking**: Instant appointment requests with live status updates.
- **Admin Dashboard**: Exclusive access for administrators to manage, confirm, or cancel appointments.
- **Responsive Design**: Polished, mobile-first UI built with Tailwind CSS and Framer Motion.
- **Email Notifications**: Automated email alerts for appointment status changes (requires SMTP configuration).

## 📂 Project Structure

To prepare for GitHub, the project is organized into `frontend` and `backend` concerns:

```text
medisync-book/
├── frontend/                # React + Vite Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── lib/             # Utilities and error handlers
│   │   ├── firebase.ts      # Firebase initialization
│   │   ├── constants.ts     # Doctor data and locations
│   │   └── types.ts         # TypeScript definitions
│   ├── public/              # Static assets
│   ├── index.html           # Entry HTML
│   └── vite.config.ts       # Vite configuration
├── backend/                 # Express Server & Firebase Config
│   ├── server.ts            # Express entry point (API & Static Serving)
│   ├── firestore.rules      # Firebase Security Rules
│   └── firebase-blueprint.json # Database structure blueprint
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/medisync-book.git
cd medisync-book
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your credentials:
```env
# Firebase Configuration (from firebase-applet-config.json)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_ID=your_database_id

# SMTP Configuration (for email notifications)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. Run the project
**Development Mode:**
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

**Production Build:**
```bash
npm run build
npm start
```

## 🔒 Firebase Security Rules
Ensure you deploy the `firestore.rules` to your Firebase project to secure your data. Only the authorized admin email (`nikhithareddylakkireddy@gmail.com`) will have full access to manage appointments.

## 📄 License
This project is licensed under the MIT License.
