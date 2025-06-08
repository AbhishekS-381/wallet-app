# MongoDB Collections & Schema Validation

---

## Collections Structure

### 1. `wallets` Collection
- **Purpose:** Stores information about each digital wallet.
- **Document Example:**
  ```json
  {
    "_id": "<UUID>",
    "name": "Alice",
    "balance": 100.1234,
    "created_at": "2025-06-08T12:00:00.000Z",
    "updated_at": "2025-06-08T12:00:00.000Z"
  }
  ```
- **Schema Validation:**
  - `name`: string, required. The wallet owner's name.
  - `balance`: double or int, required. The wallet's balance, must be >= 0, up to 4 decimal places (`multipleOf: 0.0001`).
  - `created_at`: string, required. ISO8601 date string for creation time.
  - `updated_at`: string, required. ISO8601 date string for last update.

### 2. `transactions` Collection
- **Purpose:** Stores all credit and debit transactions for wallets.
- **Document Example:**
  ```json
  {
    "_id": "<UUID>",
    "walletId": "<Wallet UUID>",
    "amount": 50.0000,
    "balance": 150.1234,
    "description": "Deposit",
    "transaction_time_stamp": "2025-06-08T12:30:00.000Z",
    "type": "Credit"
  }
  ```
- **Schema Validation:**
  - `walletId`: string, required. References the wallet for this transaction.
  - `amount`: double or int, required. Transaction amount (positive for credit, negative for debit), up to 4 decimal places (`multipleOf: 0.0001`).
  - `balance`: double or int, required. Wallet balance after the transaction, must be >= 0, up to 4 decimal places.
  - `description`: string, required. Description of the transaction.
  - `transaction_time_stamp`: string, required. ISO8601 date string for when the transaction occurred.
  - `type`: enum ["Credit", "Debit"], required. Indicates if the transaction is a credit or debit.

---

## Validation Details

### Wallets Collection
- **Required fields:** `name`, `balance`, `created_at`, `updated_at`
- **Field types and constraints:**
  - `name`: Must be a string.
  - `balance`: Must be a number (double or int), >= 0, and a multiple of 0.0001 (up to 4 decimal places).
  - `created_at` & `updated_at`: Must be strings (ISO8601 date format recommended).

### Transactions Collection
- **Required fields:** `walletId`, `amount`, `balance`, `description`, `transaction_time_stamp`, `type`
- **Field types and constraints:**
  - `walletId`: Must be a string (references a wallet's `_id`).
  - `amount`: Must be a number (double or int), can be positive or negative, and a multiple of 0.0001 (up to 4 decimal places).
  - `balance`: Must be a number (double or int), >= 0, and a multiple of 0.0001.
  - `description`: Must be a string.
  - `transaction_time_stamp`: Must be a string (ISO8601 date format recommended).
  - `type`: Must be either "Credit" or "Debit".

---

## Notes
- These schema validations help ensure data integrity and consistency in the database.
- The `multipleOf: 0.0001` constraint enforces up to 4 decimal places for all monetary values.
- All required fields must be present in each document, or MongoDB will reject the insert/update.
- Timestamps are stored as strings (ISO8601 format recommended for interoperability).
- No unique constraint is enforced on wallet names by default; multiple wallets can have the same name.
