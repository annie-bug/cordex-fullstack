# Cordex (Contact Manager)

A modern fullstack Contact Manager web application built with Next.js 15.5.3, TypeScript ^5, MongoDB, and Tailwind CSS 4.0.  
Includes secure user authentication using Auth.js (NextAuth.js) with JWT sessions.

## Features

- User registration, login, and authentication
- Create, read, update, and delete contacts
- Responsive and mobile-friendly UI designed with Tailwind CSS
- Built with TypeScript for type safety and developer experience
- Backend API routes with Next.js and MongoDB

## Tech Stack

| Technology       | Version         |
| ---------------- | --------------- |
| Next.js          | 15.5.3          |
| TypeScript       | 5.9.2           |
| MongoDB          | Atlas (cloud)   |
| Tailwind CSS     | 4.0             |
| Auth.js (NextAuth.js) | Latest          |

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Atlas cluster (or local MongoDB)
- Git

### Installation

1. Clone the repository:
2. Install dependencies:
3. Configure environment variables:

- Copy `.env.example` to `.env.local`
- Add your MongoDB URI and NextAuth secret in `.env.local`

4. Run the development server: npm run dev

Open [http://localhost:3000](http://localhost:3000) to see the app running.

## Contributing

Contributions are welcome! Please open issues or pull requests for enhancements or bug fixes.

## License

This project is licensed under the MIT License.

# Contacts API

A robust contacts management REST API built with Next.js App Router and MongoDB. Includes error handling, input validation, and follows production-level best practices.

---

## Table of Contents

- [Endpoints](#endpoints)
- [Request & Response Formats](#request--response-formats)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Production Practices](#production-practices)
- [Setup & Testing](#setup--testing)

---

## Endpoints

### GET `/api/contacts`
- Description: Fetch all contacts from the database.
- Method: `GET`
- Response: Array of contacts.

### POST `/api/contacts`
- Description: Create a new contact.
- Method: `POST`
- Request Body:


{
"name": "Alice",
"email": "alice@example.com",
"phone": "1234567890"
}

- Response: Details of created contact, including MongoDB ID.

---

## Request & Response Formats

### GET Response Example
[
{
"name": "Alice",
"email": "alice@example.com",
"phone": "1234567890",
"createdAt": "2025-09-19T18:30:00.000Z"
}
]

### POST Request Example

{
"name": "Bob",
"email": "bob@example.org",
"phone": "9998887777"
}


### POST Success Response
{
"message": "Contact created",
"contactId": "6140d3ed0422f2b7a2013efc"
}

---

## Validation

- `name`: Required, non-empty string.
- `email`: Required, valid email.
- `phone`: Required, string matching phone number format.

All incoming POST requests are validated using [Zod](https://zod.dev) schemas before processing.

---

## Error Handling

- Validation: Returns HTTP `400 Bad Request` with detailed errors.
{
"errors": ["Name is required", "Invalid email address"]
}

- Server/DB issues: Returns HTTP `500 Internal Server Error` with friendly message.
{
"error": "Failed to create contact. Please try again later."
}
- Errors are logged using `console.error` in server logs (replace with logging tooling in production when scaling).

---

## Production Practices

- Input validation performed with Zod in independent schema files.
- Error responses never expose sensitive server/database details.
- Logging via `console.error` (use real logging libraries such as Winston or Bunyan in production).
- Sensitive values (MongoDB URIs, secrets) stored using environment variables.
- Always use HTTPS and authentication (e.g., JWT, API keys) for deployment.
- Separate code for business logic, validation, and API routing for maintainability.
- Maintain tests (unit/integration) for each route (recommended for larger apps).
- Include API versioning if planning future changes.
- Document endpoints and contracts thoroughly.

---

## Setup & Testing

1. **Install dependencies:**
npm install

2. **Set environment variables:**
- Add your MongoDB URI to `.env.local`:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
  ```

3. **Run development server:**
npm run dev

4. **Test endpoints:**
- Use Postman or curl to send requests (see above for examples).

---