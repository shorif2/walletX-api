# Wallet-X

## Project Overview

Wallet-X is a secure, modular, and role-based backend API for a digital wallet system. Built with Express.js and Mongoose, it provides enterprise-grade payment infrastructure, secure transactions, global reach, and seamless integration for modern financial applications.

## Setup and Environment Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd wallet-x
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   - PORT
   - NODE_ENV
   - MONGO_URI
   - JWT_ACCESS_SECRET
   - JWT_ACCESS_EXPIRES
   - JWT_REFRESH_SECRET
   - JWT_REFRESH_EXPIRES
   - BCRYPT_SALT_ROUND
   - SUPER_ADMIN_EMAIL
   - SUPER_ADMIN_PASSWORD
   - EXPRESS_SESSION_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - GOOGLE_CALLBACK_URL
   - FRONTEND_URL
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Implemented Endpoints

All endpoints are prefixed with `https://wallet-x-api.vercel.app/api/v1`.

### Auth

#### User Login

**POST** `/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Logged In Successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhmMTNjMzcwOTUzYzdjY2UwZTljNTEiLCJlbWFpbCI6InVzZXIyQHdhbGxldHguY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NTQyNDIxOTcsImV4cCI6MTc1NDMyODU5N30.AZLWAshIpdVYMSs2uokRCs-2B2GwVkaQby6nLQVhEEs",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhmMTNjMzcwOTUzYzdjY2UwZTljNTEiLCJlbWFpbCI6InVzZXIyQHdhbGxldHguY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NTQyNDIxOTcsImV4cCI6MTc1NDMyODU5N30.AZLWAshIpdVYMSs2uokRCs-2B2GwVkaQby6nLQVhEEs",
    "user": {
      "_id": "688f13c370953c7cce0e9c51",
      "name": "User Jack",
      "email": "user2@walletx.com",
      "role": "USER",
      "isApproved": "ACTIVE",
      "isBlocked": false,
      "createdAt": "2025-08-03T07:46:11.995Z",
      "wallet": {
        "walletNumber": "WAL7912698725",
        "balance": 165,
        "isBlocked": false
      }
    }
  }
}
```

#### Refresh Access Token

**POST** `/auth/refresh-token`

**Request:** (Cookie: refreshToken)

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "New Access Token Retrived Successfully",
  "data": {
    "accessToken": "<jwt-token>",
    "refreshToken": "<jwt-token>"
  }
}
```

#### User Logout

**POST** `/auth/logout`

**Request:** (No body, clears cookies)

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User Logged Out Successfully",
  "data": null
}
```

#### Reset Password

**POST** `/auth/reset-password`

**Request:**

```json
{
  "oldPassword": "oldpass",
  "newPassword": "newpass"
}
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password Changed Successfully",
  "data": null
}
```

### User

#### Register New User

**POST** `/user/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User Created Successfully",
  "data": {
    "_id": "688f13c370953c7cce0e9c52",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "isApproved": "PENDING",
    "isBlocked": false,
    "createdAt": "2025-08-03T08:00:00.000Z",
    "wallet": {
      "walletNumber": "WAL1234567890",
      "balance": 0,
      "isBlocked": false
    }
  }
}
```

#### Get All Users (Admin)

**GET** `/user/all-users`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All Users Retrieved Successfully",
  "data": [
    {
      "_id": "688f13c370953c7cce0e9c51",
      "name": "User Jack",
      "email": "user2@walletx.com",
      "role": "USER",
      "isApproved": "ACTIVE",
      "isBlocked": false,
      "createdAt": "2025-08-03T07:46:11.995Z",
      "wallet": {
        "walletNumber": "WAL7912698725",
        "balance": 165,
        "isBlocked": false
      }
    },
    {
      "_id": "688f13c370953c7cce0e9c52",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isApproved": "PENDING",
      "isBlocked": false,
      "createdAt": "2025-08-03T08:00:00.000Z",
      "wallet": {
        "walletNumber": "WAL1234567890",
        "balance": 0,
        "isBlocked": false
      }
    }
  ],
  "meta": { "total": 2 }
}
```

#### Get Current User Profile

**GET** `/user/me`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "688f13c370953c7cce0e9c51",
    "name": "User Jack",
    "email": "user2@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T07:46:11.995Z",
    "wallet": {
      "walletNumber": "WAL7912698725",
      "balance": 165,
      "isBlocked": false
    }
  }
}
```

#### Get User by ID

**GET** `/user/:id`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Retrieved Successfully",
  "data": {
    "_id": "688f13c370953c7cce0e9c51",
    "name": "User Jack",
    "email": "user2@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T07:46:11.995Z",
    "wallet": {
      "walletNumber": "WAL7912698725",
      "balance": 165,
      "isBlocked": false
    }
  }
}
```

#### Block User (Admin)

**PATCH** `/user/:id/block`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User has been blocked",
  "data": {
    "_id": "688f13c370953c7cce0e9c51",
    "name": "User Jack",
    "email": "user2@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": true,
    "createdAt": "2025-08-03T07:46:11.995Z",
    "wallet": {
      "walletNumber": "WAL7912698725",
      "balance": 165,
      "isBlocked": false
    }
  }
}
```

#### Unblock User (Admin)

**PATCH** `/user/:id/unblock`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User has been unblocked",
  "data": {
    "_id": "688f13c370953c7cce0e9c51",
    "name": "User Jack",
    "email": "user2@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T07:46:11.995Z",
    "wallet": {
      "walletNumber": "WAL7912698725",
      "balance": 165,
      "isBlocked": false
    }
  }
}
```

### Wallet

#### Get Wallet by User ID

**GET** `/wallet/user/:userId`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wallet retrieved successfully",
  "data": {
    "walletNumber": "WAL7912698725",
    "balance": 165,
    "isBlocked": false,
    "userId": "688f13c370953c7cce0e9c51"
  }
}
```

#### Get Wallet by Wallet Number

**GET** `/wallet/:walletNumber`

**Response (200):**

```json
{
  "success": true,
  "message": "Wallet retrieved successfully",
  "data": {
    /* wallet object */
  }
}
```

#### Update Wallet Balance

**PATCH** `/wallet/:userId/balance`

**Request:**

```json
{
  "amount": 100
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wallet balance updated successfully",
  "data": {
    "walletNumber": "WAL7912698725",
    "balance": 265,
    "isBlocked": false,
    "userId": "688f13c370953c7cce0e9c51"
  }
}
```

#### Block Wallet

**PATCH** `/wallet/:userId/block`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wallet blocked successfully",
  "data": {
    "walletNumber": "WAL7912698725",
    "balance": 165,
    "isBlocked": true,
    "userId": "688f13c370953c7cce0e9c51"
  }
}
```

#### Unblock Wallet

**PATCH** `/wallet/:userId/unblock`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wallet unblocked successfully",
  "data": {
    "walletNumber": "WAL7912698725",
    "balance": 165,
    "isBlocked": false,
    "userId": "688f13c370953c7cce0e9c51"
  }
}
```

### Transaction

#### Add Money to Wallet

**POST** `/transaction/add`

**Request:**

```json
{
  "amount": 100
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Money added successfully",
  "data": {
    "_id": "789f13c370953c7cce0e9c99",
    "type": "ADD_MONEY",
    "amount": 100,
    "fromWallet": null,
    "toWallet": "WAL7912698725",
    "createdAt": "2025-08-03T09:00:00.000Z",
    "status": "SUCCESS"
  }
}
```

#### Send Money to Another User

**POST** `/transaction/send`

**Request:**

```json
{
  "receiverWalletNumber": "1234567890",
  "amount": 50
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Money sent successfully",
  "data": {
    "_id": "789f13c370953c7cce0e9c98",
    "type": "SEND_MONEY",
    "amount": 50,
    "fromWallet": "WAL7912698725",
    "toWallet": "1234567890",
    "createdAt": "2025-08-03T09:05:00.000Z",
    "status": "SUCCESS"
  }
}
```

#### Withdraw Money from Wallet

**POST** `/transaction/withdraw`

**Request:**

```json
{
  "amount": 30
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Money withdrawn successfully",
  "data": {
    "_id": "789f13c370953c7cce0e9c97",
    "type": "WITHDRAW",
    "amount": 30,
    "fromWallet": "WAL7912698725",
    "toWallet": null,
    "createdAt": "2025-08-03T09:10:00.000Z",
    "status": "SUCCESS"
  }
}
```

#### Agent Cash-In to User Wallet

**POST** `/transaction/cash-in`

**Request:**

```json
{
  "amount": 200,
  "userWalletNumber": "1234567890"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Cash-in successful",
  "data": {
    "_id": "789f13c370953c7cce0e9c96",
    "type": "CASH_IN",
    "amount": 200,
    "fromWallet": "AGENT123456",
    "toWallet": "1234567890",
    "createdAt": "2025-08-03T09:15:00.000Z",
    "status": "SUCCESS"
  }
}
```

#### Agent Cash-Out from User Wallet

**POST** `/transaction/cash-out`

**Request:**

```json
{
  "amount": 100,
  "userWalletNumber": "1234567890"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Cash-out successful",
  "data": {
    "_id": "789f13c370953c7cce0e9c95",
    "type": "CASH_OUT",
    "amount": 100,
    "fromWallet": "1234567890",
    "toWallet": "AGENT123456",
    "createdAt": "2025-08-03T09:20:00.000Z",
    "status": "SUCCESS"
  }
}
```

#### Get Current User's Transaction History

**GET** `/transaction/my-history`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Transaction history fetched successfully",
  "data": [
    {
      "_id": "789f13c370953c7cce0e9c99",
      "type": "ADD_MONEY",
      "amount": 100,
      "fromWallet": null,
      "toWallet": "WAL7912698725",
      "createdAt": "2025-08-03T09:00:00.000Z",
      "status": "SUCCESS"
    },
    {
      "_id": "789f13c370953c7cce0e9c98",
      "type": "SEND_MONEY",
      "amount": 50,
      "fromWallet": "WAL7912698725",
      "toWallet": "1234567890",
      "createdAt": "2025-08-03T09:05:00.000Z",
      "status": "SUCCESS"
    }
  ]
}
```

#### Get Transaction by ID

**GET** `/transaction/:transactionId`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Transaction fetched successfully",
  "data": {
    "_id": "789f13c370953c7cce0e9c99",
    "type": "ADD_MONEY",
    "amount": 100,
    "fromWallet": null,
    "toWallet": "WAL7912698725",
    "createdAt": "2025-08-03T09:00:00.000Z",
    "status": "SUCCESS"
  }
}
```

#### Get All Transactions (Admin)

**GET** `/transaction/`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All transactions fetched successfully",
  "data": [
    {
      "_id": "789f13c370953c7cce0e9c99",
      "type": "ADD_MONEY",
      "amount": 100,
      "fromWallet": null,
      "toWallet": "WAL7912698725",
      "createdAt": "2025-08-03T09:00:00.000Z",
      "status": "SUCCESS"
    },
    {
      "_id": "789f13c370953c7cce0e9c98",
      "type": "SEND_MONEY",
      "amount": 50,
      "fromWallet": "WAL7912698725",
      "toWallet": "1234567890",
      "createdAt": "2025-08-03T09:05:00.000Z",
      "status": "SUCCESS"
    }
  ]
}
```

### Agent

#### Create Agent (Admin)

**POST** `/agent/create`

**Request:**

```json
{
  "name": "Agent Smith",
  "email": "agent@example.com",
  "password": "123456"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Agent created successfully",
  "data": {
    "_id": "888f13c370953c7cce0e9c01",
    "name": "Agent Smith",
    "email": "agent@example.com",
    "role": "AGENT",
    "status": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T10:00:00.000Z"
  }
}
```

#### Get All Agents (Admin)

**GET** `/agent/all`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All agents retrieved successfully",
  "data": [
    {
      "_id": "888f13c370953c7cce0e9c01",
      "name": "Agent Smith",
      "email": "agent@example.com",
      "role": "AGENT",
      "status": "ACTIVE",
      "isBlocked": false,
      "createdAt": "2025-08-03T10:00:00.000Z"
    },
    {
      "_id": "888f13c370953c7cce0e9c02",
      "name": "Agent Neo",
      "email": "neo@example.com",
      "role": "AGENT",
      "status": "SUSPENDED",
      "isBlocked": true,
      "createdAt": "2025-08-03T10:10:00.000Z"
    }
  ]
}
```

#### Get Agent by ID (Admin)

**GET** `/agent/:id`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Agent retrieved successfully",
  "data": {
    "_id": "888f13c370953c7cce0e9c01",
    "name": "Agent Smith",
    "email": "agent@example.com",
    "role": "AGENT",
    "status": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T10:00:00.000Z"
  }
}
```

#### Update Agent (Admin)

**PATCH** `/agent/:id`

**Request:**

```json
{
  "name": "Agent Neo"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Agent updated successfully",
  "data": {
    "_id": "888f13c370953c7cce0e9c01",
    "name": "Agent Neo",
    "email": "agent@example.com",
    "role": "AGENT",
    "status": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T10:00:00.000Z"
  }
}
```

#### Update Agent Status (Admin)

**PATCH** `/agent/:id/status`

**Request:**

```json
{
  "status": "active"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Agent status updated successfully",
  "data": {
    "_id": "888f13c370953c7cce0e9c01",
    "name": "Agent Smith",
    "email": "agent@example.com",
    "role": "AGENT",
    "status": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T10:00:00.000Z"
  }
}
```

#### Delete Agent (Admin)

**DELETE** `/agent/:id`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Agent deleted successfully",
  "data": null
}
```

## Technologies Used

- Node.js, Express.js
- TypeScript
- MongoDB & Mongoose
- Passport.js (Local & Google OAuth)
- JWT Authentication
- Session Management
- ESLint, TypeScript, and modern tooling

## License

ISC
