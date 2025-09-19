# Supplier Backend API

A modern, high-performance backend API built with Elysia.js and TypeScript for managing supplier operations, requests, and pricing in a procurement system.

## 🚀 Overview

This backend service provides a comprehensive API for suppliers to manage procurement requests, submit pricing, upload files, and handle confirmations in a goods outcome management system. The application is built with modern TypeScript patterns, optimized database queries, and enterprise-grade security features.

## 📋 Table of Contents

-   [Features](#features)
-   [Architecture](#architecture)
-   [Tech Stack](#tech-stack)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Environment Configuration](#environment-configuration)
-   [Database Setup](#database-setup)
-   [API Documentation](#api-documentation)
-   [Project Structure](#project-structure)
-   [Security Features](#security-features)
-   [Performance Optimizations](#performance-optimizations)
-   [Development](#development)
-   [Deployment](#deployment)
-   [Contributing](#contributing)

## ✨ Features

### Core Functionality

-   **Supplier Management**: Registration, authentication, profile management
-   **Request Management**: View and manage procurement requests with pagination and filtering
-   **Pricing System**: Submit and update pricing for requested items
-   **File Upload**: Secure file upload with validation and storage management
-   **Request Confirmation**: Confirm participation in procurement requests
-   **Payment Integration**: Manage payment terms and methods
-   **Email Notifications**: Automated email confirmations and password reset

### Advanced Features

-   **JWT Authentication**: Secure token-based authentication with automatic expiration
-   **Role-based Access**: Protected routes with supplier-specific data access
-   **Database Optimization**: Lazy repository loading and selective field querying
-   **File Security**: Type validation, sanitization, and organized storage
-   **Search & Filtering**: Advanced search with collation support for Vietnamese text
-   **Audit Trail**: Comprehensive logging and error tracking
-   **Email Templates**: Customizable HTML email templates

## 🏗️ Architecture

### Database Architecture

-   **Dual Database Sources**: Separate data sources for synchronized and global data
-   **TypeORM Integration**: Full ORM support with decorators and relationships
-   **Entity Relationships**: Well-defined relationships between suppliers, requests, and pricing
-   **Optimized Queries**: Repository pattern with lazy loading and selective field queries

### API Architecture

-   **RESTful Design**: Standard HTTP methods and status codes
-   **Modular Routing**: Separated public and protected routes
-   **Middleware Pipeline**: JWT verification, CORS, static file serving
-   **Error Handling**: Centralized error handling with consistent response format

## 🛠️ Tech Stack

### Core Technologies

-   **Runtime**: [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime
-   **Framework**: [Elysia.js](https://elysiajs.com/) - TypeScript-first web framework
-   **Database**: Microsoft SQL Server with TypeORM
-   **Authentication**: JWT with automatic token verification
-   **Email**: Nodemailer with SMTP support

### Development Tools

-   **TypeScript**: Full type safety and modern JavaScript features
-   **Database ORM**: TypeORM with decorators and migrations
-   **Validation**: Custom validation schemas with type checking
-   **File Processing**: Node.js file system with async operations
-   **Template Engine**: Custom HTML template processing

## 📚 Prerequisites

-   **Bun**: v1.0+ (recommended) or Node.js 18+
-   **Microsoft SQL Server**: Any supported version
-   **SMTP Server**: For email functionality
-   **Git**: For version control

## 🚀 Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd SupplierBE
    ```

2. **Install dependencies**

    ```bash
    bun install
    # or with npm
    npm install
    ```

3. **Environment setup**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

4. **Start the development server**
    ```bash
    bun run dev
    ```

The server will start on `http://localhost:5080`

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
SQL_HOST=localhost
SQL_PORT=1433
SQL_USERNAME=your_username
SQL_PASSWORD=your_password
SQL_DB=your_database_name

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# SMTP Email Configuration
DEFAULT_SMTP_HOST=smtp.gmail.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=your_email@gmail.com
DEFAULT_SMTP_PASS=your_app_password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Setup

### Database Entities

#### Core Entities

-   **Supplier**: Supplier information and credentials
-   **Request_List**: Procurement request headers
-   **Request**: Individual items within requests
-   **RequestSupplier**: Supplier confirmation status
-   **RequestItemPrice**: Pricing submissions by suppliers
-   **RequestFile**: File attachments for requests
-   **Payment**: Payment method definitions

### Database Initialization

The application uses dual data sources:

-   **AppDataSource**: For synchronized data with schema sync enabled
-   **AppDataSourceGlobal**: For global data with manual schema management

TypeORM will automatically create tables based on entity definitions.

## 📖 API Documentation

### Authentication Endpoints

```
POST /auth/login           # Supplier login
POST /auth/register        # Supplier registration
POST /auth/logout          # Logout and clear tokens
GET  /auth/me             # Get current supplier info
POST /auth/recover        # Request password reset
PUT  /auth/reset-password # Reset password with token
```

### Protected Endpoints (Require JWT Token)

#### Request Management

```
GET  /request/getAll      # Get paginated requests with filters
GET  /request/get/:id     # Get specific request details
POST /request/migrate/:id # Submit/update pricing for request item
```

#### File Management

```
POST   /file/upload       # Upload files for requests
DELETE /file/remove/:id   # Remove specific file
```

#### Supplier Management

```
PUT /supplier/update          # Update supplier profile
PUT /supplier/update/password # Change password
```

#### Request Confirmation

```
POST /confirm/:requestId # Confirm participation in request
```

#### Payment Management

```
POST   /payment/create     # Create payment methods
DELETE /payment/remove     # Remove payment method
GET    /payment/get-all    # Get all payment methods
GET    /payment/get-options # Get payment options
```

### Request/Response Examples

#### Login Request

```json
POST /auth/login
{
  "LoginName": "supplier123",
  "SupplierPass": "secure_password"
}
```

#### Login Response

```json
{
    "SupplierID": 1234567890,
    "LoginName": "supplier123",
    "CompanyName": "ABC Company Ltd",
    "Email": "contact@abc.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Requests with Pagination

```json
GET /request/getAll?current=1&limit=10&isConfirmed=false
{
  "requests": [...],
  "page": {
    "current": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## 📁 Project Structure

```
src/
├── controllers/           # Business logic controllers
│   ├── auth.controller.ts        # Authentication operations
│   ├── request.controller.ts     # Request management
│   ├── file.controller.ts        # File upload/management
│   ├── confirm.controller.ts     # Request confirmations
│   ├── payment.controller.ts     # Payment methods
│   └── requestPrice.controller.ts # Pricing submissions
├── models/                # TypeORM entities
│   ├── default/          # Global/default entities
│   │   ├── Request.ts           # Request items
│   │   └── Request_List.ts      # Request headers
│   └── sync/             # Synchronized entities
│       ├── Supplier.ts          # Supplier information
│       ├── RequestSupplier.ts    # Confirmation records
│       ├── RequestItemPrice.ts  # Pricing data
│       ├── RequestFile.ts       # File attachments
│       └── Payment.ts           # Payment methods
├── routes/                # API route definitions
│   ├── index.ts          # Route setup and middleware
│   ├── public/           # Public routes (no auth required)
│   │   └── auth.route.ts        # Authentication routes
│   └── protected/        # Protected routes (JWT required)
│       ├── request.route.ts     # Request management routes
│       ├── file.route.ts        # File operation routes
│       ├── confirm.route.ts     # Confirmation routes
│       ├── payment.route.ts     # Payment routes
│       └── supplier.route.ts    # Supplier profile routes
├── interfaces/           # TypeScript type definitions
│   ├── data.ts           # Data structures
│   ├── http.ts           # HTTP status codes and responses
│   ├── params.ts         # Request parameters
│   ├── payload.ts        # Request payloads
│   ├── sql.ts            # Database-related types
│   └── validate.ts       # Validation schemas
├── middlewares/          # Custom middleware
│   └── jwtVerify.ts      # JWT token verification
├── services/             # External service integrations
│   └── mailer.service.ts # Email service
├── utils/                # Utility functions
│   ├── collation.ts      # Database search utilities
│   ├── response.ts       # Response helpers
│   ├── validate.ts       # Input validation
│   ├── encode.ts         # Encryption/encoding
│   ├── date.ts           # Date utilities
│   ├── mail.ts           # Email template processing
│   ├── saveFileToLocal.ts # File storage utilities
│   └── importRoutes.ts   # Dynamic route importing
├── constants/            # Validation schemas and constants
│   └── validate/
│       ├── auth.ts       # Authentication validation
│       ├── payment.ts    # Payment validation
│       └── price.ts      # Pricing validation
├── templates/            # Email templates
│   ├── confirmMail.html  # Confirmation email template
│   └── resetPassword.html # Password reset template
├── sql/                  # Database configuration
│   └── config.ts         # TypeORM data source setup
└── index.ts              # Application entry point
```

## 🔒 Security Features

### Authentication & Authorization

-   **JWT Tokens**: Secure token-based authentication with expiration
-   **Password Hashing**: Secure password storage with custom encoding
-   **Route Protection**: Middleware-based route protection
-   **Token Verification**: Automatic token validation with user context

### Input Validation

-   **Schema Validation**: Comprehensive input validation with custom schemas
-   **Type Safety**: Full TypeScript integration for compile-time safety
-   **SQL Injection Prevention**: Parameterized queries throughout
-   **File Upload Security**: File type validation and secure storage

### Data Protection

-   **Sensitive Data Removal**: Automatic removal of passwords and sensitive fields
-   **CORS Configuration**: Proper cross-origin resource sharing setup
-   **Error Handling**: Secure error responses without data leakage

## ⚡ Performance Optimizations

### Database Optimizations

-   **Lazy Repository Loading**: Repositories created only when needed
-   **Selective Field Querying**: Fetch only required database fields
-   **Query Optimization**: Parallel database operations where possible
-   **Connection Pooling**: Efficient database connection management

### Application Optimizations

-   **Repository Caching**: Cached repository instances for reuse
-   **Parallel Processing**: Concurrent operations for file uploads and deletions
-   **Efficient Search**: Optimized search with collation support
-   **Background Processing**: Non-blocking email sending

### Memory Management

-   **Resource Cleanup**: Automatic cleanup of temporary files and directories
-   **Efficient Object Creation**: Minimized object instantiation overhead
-   **Stream Processing**: Efficient file handling with streams

## 🔧 Development

### Running in Development Mode

```bash
bun run dev
```

This starts the server with file watching and automatic restarts.

### Code Quality

-   **TypeScript**: Full type safety with strict configuration
-   **Error Handling**: Comprehensive error handling with logging
-   **Documentation**: JSDoc comments for all public functions
-   **Validation**: Runtime validation for all inputs

### Testing

Currently, the project uses manual testing. Unit and integration tests can be added using your preferred testing framework.

## 🚀 Deployment

### Production Build

```bash
# Install production dependencies
bun install --production

# Start the production server
bun run src/index.ts
```

### Environment Variables

Ensure all production environment variables are properly configured:

-   Database credentials for production SQL Server
-   Strong JWT secret key
-   Production SMTP configuration
-   Correct frontend URL for password reset links

### Recommended Deployment Options

-   **Docker**: Containerize the application for consistent deployment
-   **Process Manager**: Use PM2 or similar for process management
-   **Reverse Proxy**: Use Nginx or similar for SSL and load balancing
-   **Monitoring**: Implement logging and monitoring solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

-   Follow TypeScript best practices
-   Add proper error handling for new features
-   Include JSDoc comments for public functions
-   Ensure type safety throughout the codebase
-   Test thoroughly before submitting PRs

## 📄 License

This project is part of a goods outcome management system. Please refer to your organization's licensing terms.

## 📞 Support

For support and questions:

-   Check the API documentation above
-   Review the code comments and JSDoc documentation
-   Ensure all environment variables are properly configured
-   Check database connectivity and permissions

---

**Built with ❤️ using modern TypeScript and high-performance technologies**
