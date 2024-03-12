# node-express-boilerplate

Node Express Boilerplate is a starter kit for Node.js applications with Express.js, featuring routing, authentication (Basic Auth & JWT), API documentation, ORM integration (Sequelize), input validation, logging, ESLint, Prettier, Husky for pre-commit hooks, file upload support, testing (Jest & Supertest), middleware management, error handling, CORS, rate limiting, environment configuration (dotenv), and YAML configuration.

## Functionalities

### Folder Structure

The boilerplate provides a well-organized folder structure to maintain clarity and scalability in your project. It typically includes folders for routes, controllers, models, middleware, configuration, and utilities.

### Routing

Utilize Express.js to define API routes efficiently. Route definitions are modularized to keep code clean and manageable. Separate files for routes ensure a clear separation of concerns.

### Authentication

Implement authentication mechanisms using both Basic Authentication and JSON Web Tokens (JWT). Basic Authentication is suitable for simple authentication scenarios, while JWT offers a secure and stateless method for user authentication across requests.

### API Documentation

Automatically generate API documentation using Swagger UI. Document endpoints, request parameters, and response schemas to facilitate integration and enhance developer experience.

### ORM (Object-Relational Mapping)

Integrate Sequelize, a promise-based ORM, for seamless interaction with relational databases such as MySQL. Define models to represent database tables and perform CRUD operations using object-oriented syntax.

### Validation

Ensure data integrity and security by implementing input validation using Yup. Define schemas to validate incoming data against predefined rules, preventing invalid data from reaching the application.

### Logging

Implement logging functionality using Winston, a versatile logging library for Node.js. Log application events, errors, and debug information to various transports, including console, file, and third-party services.

### ESLint and Prettier

Enforce code quality and consistency using ESLint and Prettier. ESLint identifies and reports code errors, while Prettier formats code according to predefined rules, ensuring a consistent code style across the project.

### Husky for Pre-Commit Hook

Leverage Husky to set up pre-commit hooks that run ESLint, Prettier, and other checks before committing code changes. Ensure that only clean and formatted code is committed to version control, maintaining code quality standards.

### File Upload

Handle file uploads efficiently using Multer middleware. Customize file upload settings, such as file size limits and destination directories, to accommodate various use cases, such as profile picture uploads or document attachments.

### Testing

Write unit tests and integration tests using Jest and Supertest. Test API endpoints, middleware, and utility functions to ensure robustness and reliability of the application. Incorporate test coverage reports to monitor code coverage and identify areas for improvement.

### Middleware

Utilize Express middleware for implementing cross-cutting concerns such as authentication, error handling, request logging, rate limiting, and XSS prevention. Modularize middleware functions to maintain code readability and reusability.

### Error Handling

Implement robust error handling mechanisms to gracefully handle errors and provide meaningful error responses to clients. Utilize Express error middleware to centralize error handling logic and ensure consistency in error responses.

### CORS (Cross-Origin Resource Sharing)

Enable Cross-Origin Resource Sharing (CORS) to allow client applications from different origins to access API resources. Configure CORS headers to specify allowed origins, methods, and headers, ensuring secure and controlled access to API endpoints.

### Rate Limiting

Protect API endpoints from abuse and DoS attacks by implementing rate limiting using Express Rate Limit middleware. Set appropriate rate limits to control the frequency of requests from each client IP address, preventing excessive traffic and server overload.

### Environment Configuration

Manage environment-specific configurations using dotenv. Load environment variables from a .env file into process.env, allowing for easy configuration of database connections, API keys, and other sensitive information.

### Command Guide

- **Run Tests:**

    `npm test`
    
    Runs unit tests using Jest with a timeout of 5 seconds and forces Jest to exit after all tests are complete.
    
- **Run Tests with Coverage:**
    
    `npm run test:coverage`
    
    Runs unit tests with coverage report using Jest.
    
- **Start Server:**
    
    `npm start`
    
    Starts the server using Node.js, executing the `src/index.js` file.
    
- **Start Development Server with Nodemon:**
    
    `npm run dev`
    
    Starts the development server using Nodemon, which automatically restarts the server when changes are detected in the `src` directory.
    
- **Check Code Formatting:**
    
    `npm run format`
    
    Checks code formatting using Prettier without modifying files.
    
- **Fix Code Formatting:**
    
    `npm run format:fix`
    
    Fixes code formatting issues using Prettier and modifies files accordingly.
    
- **Lint Code:**
    
    `npm run lint`
    
    Lints JavaScript files using ESLint.
    
- **Fix Linting Issues:**
    
    `npm run lint:fix`
    
    Fixes ESLint errors and warnings automatically.

To test API endpoints using Swagger documentation, follow these steps:

1. **Start the Application**: Start your Node.js application. Assuming your application is running on `http://localhost:4000`, proceed to the next step.
    
2. **Access Swagger Documentation**: Open your web browser and navigate to the Swagger documentation endpoint. In this case, the endpoint is typically `/api/v1/docs`. So, go to:
    
    `http://localhost:4000/api/v1/docs`
    
3. **Explore API Endpoints**: Once the Swagger documentation page loads, you'll see a user-friendly interface displaying all available API endpoints along with their corresponding HTTP methods and descriptions.

