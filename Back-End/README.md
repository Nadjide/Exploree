# Back-End Project

This project is a Node.js application using TypeScript and Express. It serves as a back-end API with versioned routes.

## Project Structure

- **src/**: Contains the source code for the application.
  - **app.ts**: Entry point of the application.
  - **controllers/**: Contains the controllers for handling requests.
    - **index.ts**: Exports the IndexController class.
  - **routes/**: Contains the route definitions.
    - **v1/**: Contains version 1 of the API routes.
      - **index.ts**: Exports the setRoutes function for v1 routes.
  - **types/**: Contains custom type definitions.
    - **index.ts**: Exports custom Request and Response interfaces.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd Back-End
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```

The application will be available at `http://localhost:3000`.

## API Versioning

All API routes are prefixed with `/v1`. For example, the root route can be accessed at `http://localhost:3000/v1/`.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.