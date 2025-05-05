# Express MongoDB REST API

A Node.js Express API with MongoDB integration, following best practices.

## Features

- **Express Framework**: Fast, unopinionated, minimalist web framework for Node.js
- **MongoDB with Mongoose**: MongoDB object modeling for Node.js
- **Authentication**: JWT-based authentication system
- **API Security**: Implementation of best practices for API security
- **Error Handling**: Global error handling middleware
- **Request Validation**: Input validation using express-validator
- **Logging**: Comprehensive logging with Winston
- **Rate Limiting**: API rate limiting for enhanced security
- **Environment Configuration**: Configuration management for different environments

## Project Structure

```
.
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers (controller layer)
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models (data layer)
│   ├── routes/           # Routes definitions
│   ├── utils/            # Utility classes and functions
│   ├── app.js            # Express app initialization
│   └── server.js         # Server entry point
├── .env.example          # Environment variables example
├── .gitignore            # Git ignore rules
├── package.json          # Project meta and dependencies
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth Routes
- `POST /api/v1/users` - Register a new user
- `POST /api/v1/users/login` - User login

### User Routes
- `GET /api/v1/users/profile` - Get user profile (protected)
- `PUT /api/v1/users/profile` - Update user profile (protected)

### Product Routes
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create a product (admin only)
- `PUT /api/v1/products/:id` - Update a product (admin only)
- `DELETE /api/v1/products/:id` - Delete a product (admin only)

## Environment Variables

The following environment variables are required:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Security Measures

- Secure HTTP headers with Helmet
- Input validation and sanitization
- NoSQL injection protection
- Rate limiting
- CORS configuration
- JWT authentication
- Error handling and validation

## Error Handling

The API uses a centralized error handling approach with custom error classes and middleware.

## License

This project is licensed under the MIT License.