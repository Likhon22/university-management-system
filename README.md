# University Management System

This project is a University Management System designed to streamline and simplify administrative and student management tasks. The system provides features like user management, authentication, and integration with a database for data persistence.

## Features

### **Authentication**

- **Student:**
  - Secure login and logout functionality.
  - Ability to update their password.
- **Faculty:**
  - Secure login and logout functionality.
  - Ability to update their password.
- **Admin:**
  - Secure login and logout functionality.
  - Ability to update their password.

### **Profile Management**

- **Student:**
  - Manage and update profile details, including certain specific fields.
- **Faculty:**
  - Manage and update profile details, including certain specific fields.
- **Admin:**
  - Manage and update profile details, including certain specific fields.

### **Academic Process**

- **Student:**
  - Enroll in offered courses for a specific semester.
  - View class schedules and grades.
  - Access notice boards and event updates.
- **Faculty:**
  - Manage student grades.
  - Access student personal and academic information.
- **Admin:**
  - Manage semesters, courses, offered courses, sections, rooms, and buildings.

### **Performance Optimization**

- **Redis Caching:**
  - Efficient course data caching to improve response times
  - Reduced database load for frequently accessed data
  - Automatic cache expiration to ensure data freshness

### **User Management**

- **Admin:**
  - Manage multiple user accounts.
  - Block or unblock users.
  - Change user passwords.

## Requirements

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [TypeScript](https://www.typescriptlang.org/) (v5 or higher)
- MongoDB (local or cloud-based like [MongoDB Atlas](https://www.mongodb.com/atlas))
- Redis (for data caching and performance optimization)

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd university-management-system
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   MONGO_URI=<your-mongodb-uri>
   PORT=<server-port>
   REDIS_URL=<your-redis-uri> # Optional: ioredis will use default connection if not specified
   ```

4. **Build the project:**

   ```bash
   npm run build
   ```

5. **Run the project in development mode:**

   ```bash
   npm run start:dev
   ```

6. **Run the project in production mode:**
   ```bash
   npm run start:prod
   ```

## Scripts

- **Start in development mode:**
  ```bash
  npm run start:dev
  ```
- **Start in production mode:**
  ```bash
  npm run start:prod
  ```
- **Lint the codebase:**
  ```bash
  npm run lint
  ```
- **Fix linting issues:**
  ```bash
  npm run lint:fix
  ```
- **Format the codebase:**
  ```bash
  npm run format
  ```

## Folder Structure

```plaintext
university-management-system/
├── src/
│   ├── server.ts        # Entry point for the application
│   ├── routes/          # API route definitions
│   ├── controllers/     # Handles request/response logic
│   ├── services/        # Business logic and database operations
│   ├── models/          # Mongoose schemas and models
│   └── utils/           # Utility functions
├── dist/                # Compiled JavaScript files (after build)
├── .env                 # Environment variables
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.js         # ESLint configuration
└── .prettierrc          # Prettier configuration
```

## Development

1. Ensure you have MongoDB running and the `.env` file configured.
2. Start the server in development mode:
   ```bash
   npm run start:dev
   ```

## Linting and Formatting

- **Check for linting issues:**
  ```bash
  npm run lint
  ```
- **Fix linting issues:**
  ```bash
  npm run lint:fix
  ```
- **Format the codebase:**
  ```bash
  npm run format
  ```

## Dependencies

- **Runtime:**

  - `bcrypt`: Secure password hashing
  - `cors`: Enable Cross-Origin Resource Sharing
  - `dotenv`: Load environment variables
  - `express`: Web framework
  - `http-status`: Standardized HTTP status codes
  - `ioredis`: Redis client for high-performance caching
  - `mongoose`: MongoDB object modeling
  - `zod`: Schema validation

- **Development:**
  - TypeScript, ESLint, Prettier, ts-node-dev, and more for an optimized developer experience.

## Author

#### Likhon
