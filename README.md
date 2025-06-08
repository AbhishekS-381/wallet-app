# Wallet App – Full Stack Project

## Overview
Wallet App is a modern, full stack web application for managing digital wallets and transactions. It features a StencilJS-based frontend and a Node.js/Express/MongoDB backend. The app allows users to create wallets, view balances, perform credit/debit transactions, and review transaction history with a clean, responsive UI.

---

## Tech Stack
- **Frontend:**
  - [StencilJS](https://stenciljs.com/) (Web Components, TypeScript)
  - CSS (component-scoped, light/dark theme support)
- **Backend:**
  - Node.js (JavaScript)
  - Express.js (REST API)
  - MongoDB (with Mongoose ODM)
  - Jest (testing)
- **Other:**
  - Docker (containerization)
  - ESLint (code linting)
  - CORS enabled

---

## Features
- Create and manage digital wallets
- View wallet balance
- Credit or debit funds with descriptions
- Paginated transaction history
- Export transactions as CSV
- Responsive design (desktop/mobile)
- Light and dark mode
- Toast notifications for user feedback

---

## Project Structure
```
wallet-app/
  README.md
  package.json
  backend/
    ... (API, DB, tests, Dockerfile, API documentation)
  frontend/wallet-app/
    ... (StencilJS app, components, config, build output)
```

---

## How to Set Up Locally
1. **Clone the repository:**
   ```powershell
   git clone <your-repo-url>
   cd wallet-app
   ```
2. **Install dependencies for both frontend and backend:**
   ```powershell
   cd backend
   npm install
   cd ../frontend/wallet-app
   npm install
   cd ../../
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in `backend/` and fill in MongoDB connection details.
   - For the frontend, the API base URL is set in `frontend/wallet-app/src/config.ts`:
     ```ts
     export const API_BASE_URL = 'https://wallet-app-wlvr.onrender.com';
     // Uncomment the line below and comment the above to use a local server instead
     // export const API_BASE_URL = 'http://localhost:3001';
     ```
4. **Start the app (concurrently runs both frontend and backend):**
   ```powershell
   npm install
   npm run start
   ```
   - Frontend: [http://localhost:3333](http://localhost:3333) (Stencil default)
   - Backend API: [http://localhost:3001](http://localhost:3001)
5. **Run tests:**
   - Backend: `cd backend && npm test`
   - Frontend: `cd frontend/wallet-app && npm test`

---

## Hosting / Deployment
- **Production Frontend:**
  - Hosted at: https://wallet-app-k536.onrender.com/ (API)
  - StencilJS app can be deployed to any static host (e.g., GitHub Pages, Vercel, Netlify)
- **Production Backend:**
  - Hosted at: https://wallet-app-wlvr.onrender.com/ (API base URL)
  - Dockerfile provided for containerized deployment

> **Note:** The application is hosted on a free subscription-based server. On periods of inactivity, the backend service may shut down or go to sleep. If you encounter network errors or 404 errors when using the app, first visit the health endpoint of the backend (e.g., https://wallet-app-wlvr.onrender.com/health) in your browser. Wait a few moments for the server to spin up, then try using the Wallet App again.

---

## Documentation
- **Backend API:** See `backend/API documentation.md` for all endpoints, request/response formats, and usage examples.
- **Frontend:** See `frontend/wallet-app/README.md` for component and development details.

---

## Future Enhancements
- **Authentication & Authorization:**
  - Add JWT or session-based authentication for secure wallet access.
  - Implement user registration and login.
- **Rate Limiting & Security:**
  - Add rate limiting to prevent abuse.
  - Enhance input validation and sanitization.
- **Notifications:**
  - Integrate email or push notifications for transaction alerts.
- **Multi-Currency Support:**
  - Allow wallets to support multiple currencies.
- **Admin Dashboard:**
  - Build an admin interface for monitoring wallets and transactions.
- **Improved Error Handling:**
  - Add centralized error logging and monitoring (e.g., splunk).
- **API Versioning:**
  - Support versioned API endpoints for backward compatibility.
- **Mobile App:**
  - Develop a companion mobile app using React Native or similar.
