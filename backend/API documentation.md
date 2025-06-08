# Wallet App Backend API Documentation

## Overview
This backend provides a RESTful API for managing digital wallets and their transactions. It supports wallet creation, balance retrieval, credit/debit transactions, and transaction history. All responses are in JSON format.

---

## Base URL
- Production: `https://wallet-app-wlvr.onrender.com`
- Local: `http://localhost:3001`

---

## Endpoints

### 1. Create Wallet
- **URL:** `POST /setup`
- **Body:**
  ```json
  {
    "name": "string (required)",
    "balance": "number (optional, default 0)"
  }
  ```
- **Success Response:**
  - `200 OK`
  ```json
  {
    "id": "string",
    "name": "string",
    "balance": number,
    "transactionId": "string|null",
    "date": "ISO8601 string"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: `{ "error": "Name required" }`
  - `500 Internal Server Error`: `{ "error": "..." }`

---

### 2. Get Wallet Details
- **URL:** `GET /wallet/:id`
- **Success Response:**
  - `200 OK`
  ```json
  {
    "id": "string",
    "name": "string",
    "balance": number,
    "date": "ISO8601 string"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: `{ "error": "Wallet not found" }`
  - `500 Internal Server Error`: `{ "error": "..." }`

---

### 3. Get Transactions (Paginated)
- **URL:** `GET /transactions?walletId=...&skip=...&limit=...&sortBy=...&sortDir=...`
- **Query Parameters:**
  - `walletId` (required): Wallet ID
  - `skip` (optional): Number of records to skip (default 0)
  - `limit` (optional): Number of records to return (default 100)
  - `sortBy` (optional): Field to sort by (default `transaction_time_stamp`)
  - `sortDir` (optional): `asc` or `desc` (default `desc`)
- **Success Response:**
  - `200 OK`: Array of transactions
  ```json
  [
    {
      "id": "string",
      "walletId": "string",
      "amount": number,
      "balance": number,
      "description": "string",
      "date": "ISO8601 string",
      "type": "Credit|Debit"
    },
    ...
  ]
  ```
- **Error Responses:**
  - `400 Bad Request`: `{ "error": "walletId required" }`
  - `500 Internal Server Error`: `{ "error": "..." }`

---

### 4. Get Transaction Count
- **URL:** `GET /transactions/count?walletId=...`
- **Query Parameters:**
  - `walletId` (required): Wallet ID
- **Success Response:**
  - `200 OK`
  ```json
  { "total": number }
  ```
- **Error Responses:**
  - `400 Bad Request`: `{ "error": "walletId required" }`
  - `500 Internal Server Error`: `{ "error": "..." }`

---

### 5. Credit/Debit Transaction
- **URL:** `POST /transact/:walletId`
- **Body:**
  ```json
  {
    "amount": number, // Positive for credit, negative for debit
    "description": "string (optional)"
  }
  ```
- **Success Response:**
  - `200 OK`
  ```json
  {
    "transactionId": "string",
    "balance": number
  }
  ```
- **Error Responses:**
  - `500 Internal Server Error`: `{ "error": "..." }`
  - `400 Bad Request`: `{ "error": "walletId required" }` (if walletId missing)
  - `400 Bad Request`: `{ "error": "Insufficient balance" }` (if debit exceeds balance)
  - `404 Not Found`: `{ "error": "Wallet not found" }`

---

## Error Handling
- All errors return a JSON object with an `error` field and appropriate HTTP status code.
- Common error codes: 400 (bad request), 404 (not found), 500 (internal server error).

---

## Data Types
- **Wallet**
  - `id`: string
  - `name`: string
  - `balance`: number (rounded to 4 decimals)
  - `date`: ISO8601 string
- **Transaction**
  - `id`: string
  - `walletId`: string
  - `amount`: number
  - `balance`: number (wallet balance after transaction)
  - `description`: string
  - `date`: ISO8601 string
  - `type`: "Credit" or "Debit"

---

## Security & Validation
- Inputs are validated in server-side.
- No authentication is required (for demo; add JWT/session for production).
- CORS is enabled.
- Sensitive data is not exposed.

---

## Example Usage

### Create Wallet
```bash
curl -X POST http://localhost:3001/setup -H "Content-Type: application/json" -d '{"name":"Alice","balance":100}'
```

### Get Wallet
```bash
curl http://localhost:3001/wallet/<walletId>
```

### Credit Wallet
```bash
curl -X POST http://localhost:3001/transact/<walletId> -H "Content-Type: application/json" -d '{"amount":50,"description":"Deposit"}'
```

### Debit Wallet
```bash
curl -X POST http://localhost:3001/transact/<walletId> -H "Content-Type: application/json" -d '{"amount":-20,"description":"Withdrawal"}'
```

### Get Transactions
```bash
curl "http://localhost:3001/transactions?walletId=<walletId>&skip=0&limit=10"
```

### Get Transaction Count
```bash
curl "http://localhost:3001/transactions/count?walletId=<walletId>"
```

---

## Notes
- All dates are returned as ISO8601 strings.
- Amounts are rounded to 4 decimal places.
- For production, implement authentication and rate limiting.

---

