# Wallet Number Generation Features

## Overview

This document describes the automatic wallet number generation feature that creates unique wallet numbers when users register and wallets are automatically created.

## Features Implemented

### 1. Automatic Wallet Creation During Registration

- When a user registers, a wallet is automatically created with a unique wallet number
- The wallet starts with a default balance of 50 units
- The wallet is initially unblocked

### 2. Wallet Number Generation

- **Format**: `WAL` + 10 random digits (e.g., `WAL1234567890`)
- **Uniqueness**: Each wallet number is guaranteed to be unique across the system
- **Validation**: Wallet numbers must follow the pattern `WAL\d{10}`

### 3. Database Schema Updates

- Added `walletNumber` field to the Wallet model
- Field is required, unique, and has length constraints (10-16 characters)
- Indexed for efficient queries

### 4. API Endpoints

#### Get Wallet by User ID

```
GET /api/wallets/:userId
Authorization: Bearer <token>
```

#### Get Wallet by Wallet Number

```
GET /api/wallets/number/:walletNumber
Authorization: Bearer <token>
```

#### Update Wallet Balance

```
PATCH /api/wallets/:userId/balance
Authorization: Bearer <token>
Body: { "amount": 100 }
```

#### Block/Unblock Wallet

```
PATCH /api/wallets/:userId/block
PATCH /api/wallets/:userId/unblock
Authorization: Bearer <token> (Admin only)
```

#### Send Money Using Wallet Number

```
POST /api/transactions/send
Authorization: Bearer <token>
Body: {
  "toWalletNumber": "WAL1234567890",
  "amount": 100,
  "note": "Payment for services"
}
```

## Implementation Details

### Wallet Number Generator (`src/app/utils/walletNumberGenerator.ts`)

- Generates random 10-digit numbers
- Checks for uniqueness against existing wallet numbers
- Retries up to 10 times if collision occurs
- Includes validation function for wallet number format

### Error Handling

- Graceful handling of wallet creation failures during user registration
- User creation continues even if wallet creation fails
- Detailed logging for debugging wallet creation issues

### Validation

- Zod schema validation for wallet number format
- Regex pattern: `/^WAL\d{10}$/`
- Length validation: 13-16 characters

## Usage Examples

### User Registration Flow

1. User submits registration data
2. User account is created
3. Wallet is automatically created with unique wallet number
4. Response includes user data (wallet number not exposed for security)

### Getting Wallet Information

```javascript
// Get wallet by user ID
const wallet = await WalletServices.getWalletByUserId(userId);

// Get wallet by wallet number
const wallet = await WalletServices.getWalletByWalletNumber("WAL1234567890");
```

### Sending Money Using Wallet Numbers

```javascript
// Send money using wallet number instead of user ID
const transaction = await TransactionServices.sendMoney(
  fromWalletId,
  fromUserId,
  "WAL1234567890", // toWalletNumber
  amount,
  note
);
```

### Wallet Number Validation

```javascript
import { validateWalletNumber } from "../utils/walletNumberGenerator";

const isValid = validateWalletNumber("WAL1234567890"); // true
const isInvalid = validateWalletNumber("INVALID123"); // false
```

## Security Considerations

1. **Wallet Number Exposure**: Wallet numbers are not automatically exposed in user registration responses
2. **Access Control**: Wallet endpoints require proper authentication and authorization
3. **Validation**: All wallet number inputs are validated before processing
4. **Uniqueness**: Database constraints ensure wallet number uniqueness

## Future Enhancements

1. **Wallet Number Customization**: Allow users to request specific wallet number patterns
2. **Wallet Number History**: Track wallet number changes for audit purposes
3. **Bulk Wallet Creation**: Support for creating multiple wallets with unique numbers
4. **Wallet Number Recycling**: Implement safe recycling of deleted wallet numbers

## Testing

To test the wallet number generation:

1. Register a new user
2. Check the database for the created wallet with a unique wallet number
3. Verify the wallet number format follows the `WAL\d{10}` pattern
4. Test wallet retrieval by both user ID and wallet number
5. Verify uniqueness by attempting to create duplicate wallet numbers
