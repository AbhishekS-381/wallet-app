# Wallet App Backend

## Overview
This is the backend for the Wallet App, providing a RESTful API for digital wallet management. It allows users to create wallets, retrieve balances, perform credit/debit transactions, and view transaction history. The backend is built with Node.js, Express, and MongoDB.

---

## Functional Brief
- **Wallet Creation:** Create a new wallet with an optional initial balance.
- **Wallet Retrieval:** Fetch wallet details by ID.
- **Transactions:** Credit or debit funds from a wallet, with each transaction recorded.
- **Transaction History:** Retrieve paginated transaction history for a wallet.
- **Transaction Count:** Get the total number of transactions for a wallet.
- **Error Handling:** All endpoints return clear error messages and appropriate HTTP status codes.

---

## Technical Brief
- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose for ODM)
- **Architecture:**
  - **Controllers:** Handle HTTP requests and responses.
  - **Services:** Contain business logic and database operations.
  - **Models:** Manage database connections.
  - **Routes:** Define API endpoints.
  - **Utils:** Utility functions (e.g., rounding, date formatting).
- **Testing:** Jest for unit and integration tests (see `spec/` directory).
- **Validation:** Input validation in controllers; errors returned for invalid/missing data.
- **Security:**
  - CORS enabled.
  - No sensitive data exposed in responses.
  - No authentication (for demo; add JWT/session for production).
- **Configuration:**
  - Environment variables for sensitive data (e.g., database URL).
  - Dockerfile provided for containerization.
- **Linting:** ESLint for code quality.

---

## Documentation
- See `API documentation.md` for detailed API endpoints, request/response formats, and usage examples.

---

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your environment variables (see `.env.example` if available).
3. Start the backend server:
   ```sh
   npm start
   ```
4. Run tests:
   ```sh
   npm test
   ```
