# Agent Management Features

This document describes the agent management system implemented for the wallet application, allowing admins to create, approve, suspend, and manage agents.

## Overview

The agent management system provides comprehensive functionality for:

- Creating new agents
- Approving pending agents
- Suspending active agents
- Managing agent information
- Tracking agent performance

## Agent Status Flow

```
PENDING → APPROVED → SUSPENDED
   ↓         ↓         ↓
REJECTED   SUSPENDED  APPROVED
```

## API Endpoints

### Base URL: `/api/agent`

### 1. Create Agent

- **POST** `/create`
- **Access**: Admin, Super Admin
- **Description**: Create a new agent account
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "address": "123 Main Street, City, Country",
  "nidNumber": "1234567890123456",
  "commissionRate": 5.5
}
```

- **Response**:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Agent created successfully",
  "data": {
    "_id": "agent_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "address": "123 Main Street, City, Country",
    "nidNumber": "1234567890123456",
    "status": "PENDING",
    "commissionRate": 5.5,
    "totalEarnings": 0,
    "totalTransactions": 0,
    "createdBy": "admin_user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Agents

- **GET** `/all`
- **Access**: Admin, Super Admin
- **Query Parameters**:
  - `status`: Filter by status (PENDING, APPROVED, SUSPENDED, REJECTED)
  - `search`: Search by name, email, phone, or NID number
- **Response**: Array of agents with populated user references

### 3. Get Agent by ID

- **GET** `/:id`
- **Access**: Admin, Super Admin
- **Response**: Single agent with populated user references

### 4. Update Agent

- **PATCH** `/:id`
- **Access**: Admin, Super Admin
- **Description**: Update agent information (cannot update suspended/rejected agents)
- **Request Body**:

```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "address": "Updated Address",
  "commissionRate": 6.0
}
```

### 5. Update Agent Status

- **PATCH** `/:id/status`
- **Access**: Admin, Super Admin
- **Description**: Approve, suspend, reject, or reset agent status
- **Request Body**:

```json
{
  "status": "APPROVED"
}
```

or

```json
{
  "status": "SUSPENDED",
  "reason": "Violation of terms and conditions"
}
```

### 6. Delete Agent

- **DELETE** `/:id`
- **Access**: Admin, Super Admin
- **Description**: Delete agent (only if no transactions exist)

### 7. Get Agents by Status

- **GET** `/status/pending` - Get pending agents
- **GET** `/status/approved` - Get approved agents
- **GET** `/status/suspended` - Get suspended agents
- **Access**: Admin, Super Admin

## Agent Status Types

### PENDING

- Initial status for newly created agents
- Agents cannot perform transactions
- Requires admin approval

### APPROVED

- Agents can perform transactions
- Can be suspended or rejected
- Tracks approval details (who approved, when)

### SUSPENDED

- Agents cannot perform transactions
- Requires suspension reason
- Can be re-approved
- Tracks suspension details (who suspended, when, reason)

### REJECTED

- Final status for rejected agents
- Cannot be changed to other statuses
- Agents cannot perform transactions

## Data Model

### Agent Schema

```typescript
interface IAgent {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  nidNumber: string;
  status: AgentStatus;
  commissionRate: number;
  totalEarnings: number;
  totalTransactions: number;
  createdBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  suspendedBy?: Types.ObjectId;
  suspendedAt?: Date;
  suspensionReason?: string;
}
```

## Business Rules

1. **Email Uniqueness**: Each agent must have a unique email address
2. **NID Uniqueness**: Each agent must have a unique NID number
3. **Commission Rate**: Must be between 0 and 100
4. **Status Transitions**:
   - PENDING → APPROVED/REJECTED
   - APPROVED → SUSPENDED
   - SUSPENDED → APPROVED
   - Cannot update suspended/rejected agents
5. **Suspension**: Requires a reason when suspending
6. **Deletion**: Cannot delete agents with existing transactions

## Authentication & Authorization

- All endpoints require authentication
- Only ADMIN and SUPER_ADMIN roles can access agent management
- User performing actions is tracked in the database

## Error Handling

The system provides comprehensive error handling for:

- Duplicate email/NID
- Invalid agent ID
- Invalid status transitions
- Unauthorized access
- Validation errors
- Business rule violations

## Usage Examples

### Creating an Agent

```bash
curl -X POST http://localhost:3000/api/agent/create \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "1234567890",
    "address": "456 Oak Street, City, Country",
    "nidNumber": "9876543210987654",
    "commissionRate": 4.5
  }'
```

### Approving an Agent

```bash
curl -X PATCH http://localhost:3000/api/agent/AGENT_ID/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED"
  }'
```

### Suspending an Agent

```bash
curl -X PATCH http://localhost:3000/api/agent/AGENT_ID/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SUSPENDED",
    "reason": "Multiple customer complaints"
  }'
```

## Future Enhancements

1. **Agent Dashboard**: Web interface for agent management
2. **Bulk Operations**: Approve/suspend multiple agents at once
3. **Agent Performance Metrics**: Detailed analytics and reporting
4. **Notification System**: Email/SMS notifications for status changes
5. **Document Upload**: Support for agent documents and verification
6. **Commission Tracking**: Detailed commission calculation and history
