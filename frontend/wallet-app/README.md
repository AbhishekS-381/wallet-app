# Wallet App Frontend

A modern, responsive, and modular web application for managing digital wallets, built with [StencilJS](https://stenciljs.com/).

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Technical Stack](#technical-stack)
- [Setup & Development](#setup--development)
- [Build & Deployment](#build--deployment)
- [API Integration](#api-integration)
- [Styling](#styling)
- [License](#license)

---

## Overview
This frontend is part of a wallet management system. It allows users to create wallets, view balances, perform credit/debit transactions, and review transaction history. The app is built as a set of reusable web components using StencilJS, ensuring high performance and easy integration.

---

## Features
- **Wallet Creation:** Users can create a new wallet with an initial balance.
- **Dashboard:** View wallet details, current balance, and perform transactions.
- **Transactions:** Credit or debit funds with descriptions, and view transaction history.
- **Export:** Download transaction history as a CSV file.
- **Notifications:** User feedback for actions and errors.
- **Responsive Design:** Works well on desktop and mobile.
- **Theme Support:** Light and dark mode detection based on system preferences.

---

## Project Structure
```text
frontend/wallet-app/
  ├── src/
  │   ├── components/
  │   │   ├── wallet-app-root/         # Main app shell
  │   │   ├── wallet-dashboard/        # Wallet overview & transaction form
  │   │   ├── wallet-setup/            # Wallet creation form
  │   │   ├── wallet-transactions/     # Transaction history & export
  │   │   ├── wallet-transactions-table/ # Table for paginated transactions
  │   │   └── notification-toast/      # Toast notifications
  │   ├── config.ts                    # API base URL config
  │   ├── index.html                   # App entry HTML
  │   └── index.ts                     # Component exports
  ├── www/                             # Build output
  ├── package.json
  ├── stencil.config.ts
  └── tsconfig.json
```

---

## Core Components

### `<wallet-app-root>`
- App shell, handles routing between setup, dashboard, and transactions.
- Manages theme, notifications, and wallet state.

### `<wallet-setup>`
- Form to create a new wallet.
- Emits events for wallet creation and notifications.

### `<wallet-dashboard>`
- Displays wallet info and balance.
- Form for credit/debit transactions.
- Emits events for transaction results and navigation.

### `<wallet-transactions>`
- Shows transaction history.
- Allows exporting transactions as CSV.
- Contains `<wallet-transactions-table>` for paginated display.

### `<wallet-transactions-table>`
- Paginated, sortable table of transactions for a wallet.

### `<notification-toast>`
- Displays success/error messages as toast notifications.

---

## Technical Stack
- **Framework:** [StencilJS](https://stenciljs.com/) (Web Components)
- **Language:** TypeScript
- **Styling:** CSS (component-scoped)
- **API:** RESTful backend (configurable via `src/config.ts`)
- **Build Tool:** Stencil CLI

---

## Setup & Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm start
   ```
   The app will be served locally with hot-reload.
3. **Lint the code:**
   ```sh
   npm run lint
   ```

---

## Build & Deployment
- **Build for production:**
  ```sh
  npm run build
  ```
- **Deploy to GitHub Pages:**
  ```sh
  npm run deploy
---

## API Integration
- The frontend communicates with a backend API.
- The base URL is set in `src/config.ts`:
  ```ts
  export const API_BASE_URL = 'https://wallet-app-wlvr.onrender.com';
  // For local dev: 'http://localhost:3001'
  ```
- Proxy configuration for local development is in `proxy.conf.json`.

---

## Styling
- Each component has its own CSS file for modular, scoped styles.
- The app supports light and dark themes, auto-detected from the OS.
