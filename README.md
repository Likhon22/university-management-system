# University Management System

This project is a University Management System designed to streamline and simplify administrative and student management tasks. The system provides features like user management, authentication, and integration with a database for data persistence.

## Features

- User authentication with secure password hashing using bcrypt
- Structured data validation using Zod
- Database integration with MongoDB via Mongoose
- Environment variable management with dotenv
- CORS configuration for secure cross-origin requests
- Customizable linting and formatting using ESLint and Prettier
- TypeScript support for robust type-checking

## Requirements

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [TypeScript](https://www.typescriptlang.org/) (v5 or higher)
- MongoDB (local or cloud-based like [MongoDB Atlas](https://www.mongodb.com/atlas))

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
  - `mongoose`: MongoDB object modeling
  - `zod`: Schema validation

- **Development:**
  - TypeScript, ESLint, Prettier, ts-node-dev, and more for an optimized developer experience.

## Author

#### Likhon
