# Wallet-X

## Project Overview

Wallet-X is a secure and modular Digital Wallet API with JWT authentication and role-based access for Admins, Users, and Agents. Supports wallet creation on registration, money transfers, withdrawals, top-ups, and full transaction tracking. Admins can manage users, agents, and wallets with route-level access control.

### **📌 Key Features of this project**

- 🔐 JWT-based login system with secure password hashing
- Role-based access for Admins, Users, and Agents
- 💳 Automatic wallet creation on registration with initial balance
- 💸 Full transaction capabilities: top-up, withdraw, send money
- 🧾 Persistent transaction logging and history tracking
- 🛡️ Route protection based on user roles
- 🧑‍💼 Admin controls for user/agent management and wallet access
- ✅ Role-based route protection must be implemented

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

3. ### Environment Variables

```bash
# Production environment variables
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/walletX

# JWT
JWT_ACCESS_SECRET=walletX
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=walletXRefresh
JWT_REFRESH_EXPIRES=1d

# BCRYPT
BCRYPT_SALT_ROUND=10

# SUPER ADMIN
SUPER_ADMIN_EMAIL=superAdmin@walletx.com
SUPER_ADMIN_PASSWORD=walletX123

# Google
GOOGLE_CLIENT_SECRET=googleClientSecret
GOOGLE_CLIENT_ID=googleClientId
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Express Session
EXPRESS_SESSION_SECRET=express-session

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

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

# Auth

### User Login

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

### Logout

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

### Reset Password

**POST** `/auth/reset-password`

**Request:** (Requires JWT token in the header name `authorization`)

```json
{
  "newPassword": "Password123!!",
  "oldPassword": "Password123!"
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

# User

### Register New User

**POST** `/user/register`

**Request:**

```json
{
  "name": "Shorif Ahamed",
  "email": "shorif@walletx.com",
  "password": "Password123!"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User Created Successfully",
  "data": {
    "_id": "688fce730abe271d15a250af",
    "name": "Shorif Ahamed",
    "email": "shorif@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T21:02:43.072Z",
    "wallet": "688fce730abe271d15a250b2"
  }
}
```

### Register As Agent

**POST** `/user/register`

**Request:**

```json
{
  "name": "Agent carter",
  "email": "carter@walletx.com",
  "password": "Password123!",
  "role": "AGENT"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User Created Successfully",
  "data": {
    "_id": "689092a37f1cbd8147e1ab75",
    "name": "Agent carter",
    "email": "carter@walletx.com",
    "role": "AGENT",
    "isApproved": "PENDING",
    "isBlocked": false,
    "createdAt": "2025-08-04T10:59:47.151Z",
    "wallet": "689092a37f1cbd8147e1ab78"
  }
}
```

### Get All Users (Admin)

**GET** `/user/all-users`

**Response (200):**

```json
{
    "statusCode": 201,
    "success": true,
    "message": "All Users Retrieved Successfully",
    "meta": {
        "total": 3
    },
    "data": [
        {
            "_id": "688fcee90abe271d15a250b7",
            "name": "Shorif Ahamed",
            "email": "shorif@walletx.com",
            "role": "USER",
            "isApproved": "ACTIVE",
            "isBlocked": false,
            "createdAt": "2025-08-03T21:04:41.688Z",
            "wallet": {
                "walletNumber": "WAL4758189412",
                "balance": 270,
                "isBlocked": false
            }
        },
        {...}
    ]
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

### Personal Profile

**GET** `/user/me`

**Request:** (Requires JWT token in the header name `authorization`)

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "688fcee90abe271d15a250b7",
    "name": "Shorif Ahamed",
    "email": "shorif@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T21:04:41.688Z",
    "wallet": {
      "walletNumber": "WAL4758189412",
      "balance": 270,
      "isBlocked": false
    }
  }
}
```

### User by ID

**GET** `/user/:id`

**Request:** (Requires JWT token in the header name `authorization`)

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Retrieved Successfully",
  "data": {
    "_id": "688fcee90abe271d15a250b7",
    "name": "Shorif Ahamed",
    "email": "shorif@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T21:04:41.688Z",
    "wallet": {
      "walletNumber": "WAL4758189412",
      "balance": 270,
      "isBlocked": false
    }
  }
}
```

### Block User (Admin)

**PATCH** `/user/:id/block`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User has been blocked",
  "data": {
    "_id": "688fcf060abe271d15a250bf",
    "name": "Jack Ahamed",
    "email": "jack@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": true,
    "createdAt": "2025-08-03T21:05:10.668Z",
    "wallet": {
      "walletNumber": "WAL2050871411",
      "balance": 50,
      "isBlocked": true
    }
  }
}
```

### Unblock User (Admin)

**PATCH** `/user/:id/unblock`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User has been unblocked",
  "data": {
    "_id": "688fcf060abe271d15a250bf",
    "name": "Jack Ahamed",
    "email": "jack@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T21:05:10.668Z",
    "wallet": {
      "walletNumber": "WAL2050871411",
      "balance": 50,
      "isBlocked": true
    }
  }
}
```

# Wallet

### Get Wallet by User ID

**GET** `/wallet/user/:userId`

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Retrieved Successfully",
  "data": {
    "_id": "688fcee90abe271d15a250b7",
    "name": "Shorif Ahamed",
    "email": "shorif@walletx.com",
    "role": "USER",
    "isApproved": "ACTIVE",
    "isBlocked": false,
    "createdAt": "2025-08-03T21:04:41.688Z",
    "wallet": {
      "walletNumber": "WAL4758189412",
      "balance": 270,
      "isBlocked": false
    }
  }
}
```

### Get Wallet by Wallet Number (Admin)

**GET** `/wallet/:walletNumber`

**Response (200):**

```json
{
  "success": true,
  "message": "Wallet retrieved successfully",
  "data": {
    "_id": "688fceea0abe271d15a250ba",
    "walletNumber": "WAL4758189412",
    "balance": 50,
    "accountType": "Savings",
    "isBlocked": false,
    "user": {
      "_id": "688fcee90abe271d15a250b7",
      "name": "Shorif Ahamed",
      "email": "shorif@walletx.com",
      "role": "USER",
      "isApproved": "ACTIVE",
      "isBlocked": false
    },
    "createdAt": "2025-08-03T21:04:42.332Z"
  }
}
```

### Block Wallet

**PATCH** `/wallet/:userId/block`

**Response (200):**

```json
{
  "success": true,
  "message": "Wallet blocked successfully",
  "data": {
    "_id": "688fceea0abe271d15a250ba",
    "walletNumber": "WAL4758189412",
    "balance": 50,
    "accountType": "Savings",
    "isBlocked": true,
    "user": {
      "_id": "688fcee90abe271d15a250b7",
      "name": "Shorif Ahamed",
      "email": "shorif@walletx.com",
      "role": "USER",
      "isBlocked": false
    },
    "createdAt": "2025-08-03T21:04:42.332Z"
  }
}
```

### Unblock Wallet

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

# Transaction

### Add Money to Wallet

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
  "success": true,
  "message": "Money added successfully",
  "data": {
    "type": "add",
    "initiatedBy": "688fcee90abe271d15a250b7",
    "amount": 50,
    "status": "completed",
    "_id": "688fd70620f2d6c09c41c00c",
    "createdAt": "2025-08-03T21:39:18.279Z",
    "updatedAt": "2025-08-03T21:39:18.279Z"
  }
}
```

### Send Money to Another User

**POST** `/transaction/send`

**Request:**

```json
{
  "recieverWallet": "WAL9833982578",
  "amount": 15,
  "note": "Birthday Gift"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Money sent successfully",
  "data": {
    "senderWallet": "WAL4758189412",
    "type": "send",
    "initiatedBy": "688fcee90abe271d15a250b7",
    "recieverWallet": "WAL9833982578",
    "note": "Birthday Gift",
    "amount": 15,
    "status": "completed",
    "_id": "688fd9ad5f106679f1df46b9",
    "createdAt": "2025-08-03T21:50:37.922Z",
    "updatedAt": "2025-08-03T21:50:37.922Z"
  }
}
```

### Withdraw Money from Wallet

**POST** `/transaction/withdraw`

**Request:**

```json
{
  "amount": 25,
  "note": "For buying a Macbook"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Money withdrawn successfully",
  "data": {
    "type": "withdraw",
    "initiatedBy": "688fcee90abe271d15a250b7",
    "note": "For buying a Macbook",
    "amount": 25,
    "status": "completed",
    "_id": "688fd7aeab1afb68b2e76bde",
    "createdAt": "2025-08-03T21:42:06.580Z",
    "updatedAt": "2025-08-03T21:42:06.580Z"
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

### My Transaction History

**GET** `/transaction/my-history`

**Request:** (Requires JWT token in the header name `authorization`)

**Response (201):**

```json
{
    "success": true,
    "message": "Transaction history retrieved successfully",
    "data": [
        {
            "_id": "688fda24dadf2fbff4a1ebcb",
            "senderWallet": "WAL4758189412",
            "type": "send",
            "initiatedBy": {
                "_id": "688fcee90abe271d15a250b7",
                "name": "Shorif Ahamed",
                "email": "shorif@walletx.com"
            },
            "recieverWallet": "WAL9833982578",
            "note": "Birthday Gift",
            "amount": 15,
            "status": "completed",
            "createdAt": "2025-08-03T21:52:36.812Z",
            "updatedAt": "2025-08-03T21:52:36.812Z"
        },{...}]}
```

### Transactions by ID (Admin)

**GET** `/transaction/:transactionId`

**Request:** (Requires JWT token in the header name `authorization`)

**Response (201):**

```json
{
  "success": true,
  "message": "Transaction retrieved successfully",
  "data": {
    "_id": "688fd3cfcdbac48f61f191b2",
    "senderWallet": "WAL4758189412",
    "walletNumber": "WAL4758189412",
    "type": "add",
    "initiatedBy": {
      "_id": "688fcee90abe271d15a250b7",
      "name": "Shorif Ahamed",
      "email": "shorif@walletx.com"
    },
    "amount": 100,
    "status": "completed",
    "createdAt": "2025-08-03T21:25:35.007Z",
    "updatedAt": "2025-08-03T21:25:35.646Z"
  }
}
```

### Get All Transactions with query

**GET** `/transaction`

Supports filtering, and sorting.

#### Example Query:

`page=1&limit=10&type=add&status=completed`

#### Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Number of results (default: 10)
- `type`: Filter by type (add, send, cash-in, cash-out)
- `status`: Filter by status (completed, pending)

#### Response:

```json
{
    "success": true,
    "message": "All transactions retrieved successfully",
    "data": [
        {
            "_id": "688fda24dadf2fbff4a1ebcb",
            "senderWallet": "WAL4758189412",
            "type": "send",
            "initiatedBy": {
                "_id": "688fcee90abe271d15a250b7",
                "name": "Shorif Ahamed",
                "email": "shorif@walletx.com"
            },
            "recieverWallet": "WAL9833982578",
            "note": "Birthday Gift",
            "amount": 15,
            "status": "completed",
            "createdAt": "2025-08-03T21:52:36.812Z",
            "updatedAt": "2025-08-03T21:52:36.812Z"
        },
        {...}
    ],
    "meta": {
        "total": 8,
        "page": 1,
        "totalPages": 1,
        "limit": 10
    }
}
```

# Agent

### Get All Agents (Admin)

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

### Get Agent by ID (Admin)

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

### Update Agent (Admin)

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

### Update Agent Status (Admin)

**PATCH** `/agent/:id/status`

**Request:**

```json
{
  "status": "APPROVED"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Agent has been APPROVED successfully",
  "data": {
    "_id": "689092a37f1cbd8147e1ab75",
    "name": "Agent carter",
    "email": "carter@walletx.com",
    "role": "AGENT",
    "isApproved": "APPROVED",
    "isBlocked": false,
    "createdAt": "2025-08-04T10:59:47.151Z",
    "wallet": "689092a37f1cbd8147e1ab78"
  }
}
```

### Agent Cash-In

**POST** `/transaction/cash-in`

**Request:**

```json
{ "walletNumber": "WAL4765095969", "amount": 10, "note": "payment" }
```

**Response (200):**

```json
{
  "success": true,
  "message": "Agent cash-in completed successfully",
  "data": {
    "walletNumber": "WAL4765095969",
    "type": "cash-in",
    "initiatedBy": "689092a37f1cbd8147e1ab75",
    "note": "Agent cash-in",
    "amount": 11,
    "status": "completed",
    "_id": "6890a7622dd608426c54ede2",
    "createdAt": "2025-08-04T12:28:18.365Z",
    "updatedAt": "2025-08-04T12:28:18.365Z"
  }
}
```

### Agent Cash-Out

**POST** `/transaction/cash-out`

**Request:**

```json
{ "walletNumber": "WAL4765095969", "amount": 10, "note": "Maintanance Fee" }
```

**Response (200):**

```json
{
  "success": true,
  "message": "Agent cash-out completed successfully",
  "data": {
    "walletNumber": "WAL4765095969",
    "type": "cash-out",
    "initiatedBy": "689092a37f1cbd8147e1ab75",
    "note": "Agent cash-out: Birthday Gift",
    "amount": 10,
    "status": "completed",
    "_id": "6890a5e90297bbbf9af49688",
    "createdAt": "2025-08-04T12:22:01.178Z",
    "updatedAt": "2025-08-04T12:22:01.178Z"
  }
}
```

# Technologies Used

- Node.js, Express.js
- TypeScript
- MongoDB & Mongoose
- Passport.js (Local & Google OAuth)
- JWT Authentication
- Session Management
- ESLint, TypeScript, and modern tooling

# License

ISC
