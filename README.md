# Wallet-X API

A secure, modular, and role-based backend API for a digital wallet system built with Express.js, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Wallet Management**: Create, view, and manage digital wallets
- **Transaction System**: Add money, send money, withdraw money, and view transaction history
- **Role-Based Access**: SUPER_ADMIN, ADMIN, USER, and AGENT roles with different permissions
- **Google OAuth Integration**: Social login support
- **Security Features**: Password hashing, JWT tokens, session management
- **API Documentation**: Comprehensive API endpoints with validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js, Google OAuth
- **Validation**: Zod schema validation
- **Error Handling**: Custom error handling middleware
- **Security**: bcryptjs, express-session, CORS

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database (local or MongoDB Atlas)
- Google OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd wallet-x
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/wallet-x

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRES=7d

# Security Configuration
BCRYPT_SALT_ROUND=12
EXPRESS_SESSION_SECRET=your_session_secret_here

# Super Admin Configuration
SUPER_ADMIN_EMAIL=admin@wallet-x.com
SUPER_ADMIN_PASSWORD=secure_password_here

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Users

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/all` - Get all users (Admin only)

### Wallets

- `POST /wallet/create` - Create a new wallet
- `GET /wallet/my-wallet` - Get user's wallet
- `GET /wallet/all` - Get all wallets (Admin only)

### Transactions

- `POST /transaction/add-money` - Add money to wallet
- `POST /transaction/send-money` - Send money to another user
- `POST /transaction/withdraw` - Withdraw money from wallet
- `GET /transaction/history` - Get transaction history
- `GET /transaction/:id` - Get specific transaction
- `GET /transaction/all` - Get all transactions (Admin only)

### Health Check

- `GET /health` - API health check

## 🚀 Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel. Follow these steps:

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Build the project**:

   ```bash
   npm run build
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Configure Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the environment variables from your `.env` file

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Alternative Deployment Options

- **Heroku**: Use the Heroku CLI and configure environment variables
- **Railway**: Connect your GitHub repository and configure environment variables
- **DigitalOcean App Platform**: Deploy directly from GitHub
- **AWS**: Use AWS Elastic Beanstalk or EC2

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/
│   ├── config/          # Configuration files
│   ├── errorHelpers/    # Error handling utilities
│   ├── helpers/         # Helper functions
│   ├── middlewares/     # Express middlewares
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── user/        # User management
│   │   ├── wallet/      # Wallet management
│   │   └── transaction/ # Transaction management
│   ├── routes/          # Route definitions
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different user roles
- **Input Validation**: Zod schema validation for all inputs
- **CORS Protection**: Configurable CORS settings
- **Session Management**: Secure session handling
- **Error Handling**: Comprehensive error handling without exposing sensitive information

## 🧪 Testing

To run tests (when implemented):

```bash
npm test
```

## 📝 API Documentation

For detailed API documentation, you can:

1. Use tools like Postman or Insomnia to test the endpoints
2. Check the route files in `src/app/modules/` for endpoint details
3. Use the health check endpoint to verify API status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
2. Review the error logs in your deployment platform
3. Check the MongoDB connection and environment variables
4. Verify all required environment variables are set

## 🔄 Version History

- **v1.0.0**: Initial release with core wallet and transaction functionality
