Staff API

A REST API for an employee register, built with Node.js/TypeScript (Express) and a simple React/Tailwind frontend.
Data is stored in memory and will be lost when the server restarts.

Getting Started
Requirements

Node.js v20+

npm

Installation

Clone the repo and install dependencies:

git clone https://github.com/SofiePellegrini/employee-api.git

cd employee-api

# install root dependencies (includes concurrently)
npm install

# install server + web dependencies
npm run install:all

Development

Run both backend and frontend together:

npm run dev


API runs at http://localhost:8000

Frontend runs at http://localhost:3000

API Endpoints

GET /api/employees – list all employees

POST /api/employees – create new employee

Body: { "firstName": "...", "lastName": "...", "email": "..." }

DELETE /api/employees/:id – delete employee

Rules

All fields are required

Email must contain @, is lowercased, and must be unique

Frontend (React GUI)

A simple frontend is available in /web:

Form to add employees

List of all employees

Delete employee with inline Confirm/Cancel

Runs at http://localhost:3000
 when npm run dev is running.

Tests

The API is covered with Vitest + Supertest tests.

Run tests with:

cd server
npm run test
