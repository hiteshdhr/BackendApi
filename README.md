# Task Management API

A backend REST API for a Task Management app built using Node.js, Express, PostgreSQL and MongoDB. This was built as a learning project during my final year B.Tech IT.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **User DB**: PostgreSQL (via `pg` library)
- **Task DB**: MongoDB (via Mongoose)
- **Auth**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Environment Variables**: dotenv

---

## Project Structure

```
BackendAPI/
│
├── config/
│   ├── mongo.js         # MongoDB connection setup
│   └── postgres.js      # PostgreSQL connection + table creation
│
├── controllers/
│   ├── authController.js   # register, login, profile logic
│   └── taskController.js   # CRUD operations for tasks
│
├── middleware/
│   ├── authMiddleware.js   # verifies JWT token
│   ├── errorHandler.js     # global error handler
│   └── validate.js         # Joi validation schemas
│
├── models/
│   └── Task.js          # Mongoose schema for tasks
│
├── routes/
│   ├── authRoutes.js    # /api/auth routes
│   └── taskRoutes.js    # /api/tasks routes
│
├── .env.example         # sample environment variables
├── .gitignore
├── package.json
├── server.js            # main entry point
└── README.md
```

### Why two databases?
I used PostgreSQL for users because relational data (email unique constraint, joins later) is better handled there. MongoDB is used for tasks because NoSQL is more flexible for documents where fields might change.

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd BackendAPI
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
PORT=5000
JWT_SECRET=someRandomSecretKey

PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=yourpassword
PG_DATABASE=taskmanagement

MONGO_URI=mongodb://localhost:27017/taskmanagement
```

### 3. Database Setup

#### PostgreSQL
- Make sure PostgreSQL is installed and running
- Create a database called `taskmanagement`:
  ```sql
  CREATE DATABASE taskmanagement;
  ```
- The `users` table will be created automatically when you start the server

#### MongoDB
- Make sure MongoDB is installed and running locally
- The database and collection will be created automatically

### 4. Run the Server

```bash
# development mode (with auto-reload)
npm run dev

# or production
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth Routes

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "mypassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

---

#### POST `/api/auth/login`
Login and get a JWT token.

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "mypassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### GET `/api/auth/profile`
Get your profile. **Requires token.**

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Task Routes

> All task routes require `Authorization: Bearer <token>` header

#### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Submit assignment",
  "description": "Need to submit the OS assignment",
  "dueDate": "2024-01-20",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "message": "Task created",
  "task": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Submit assignment",
    "description": "Need to submit the OS assignment",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "status": "pending",
    "userId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### GET `/api/tasks`
Get all tasks of the logged in user.

**Response (200):**
```json
{
  "tasks": [
    {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
      "title": "Submit assignment",
      "description": "Need to submit the OS assignment",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "status": "pending",
      "userId": 1
    }
  ]
}
```

---

#### GET `/api/tasks/:id`
Get a single task by its MongoDB ID.

**Response (200):**
```json
{
  "task": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Submit assignment",
    "status": "pending",
    "userId": 1
  }
}
```

---

#### PUT `/api/tasks/:id`
Update a task. You can send only the fields you want to update.

**Request Body (partial update - only send what you want to change):**
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "message": "Task updated",
  "task": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Submit assignment",
    "status": "completed",
    "userId": 1
  }
}
```

---

#### DELETE `/api/tasks/:id`
Delete a task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad Request - validation failed or email already exists |
| 401 | Unauthorized - token missing or invalid |
| 403 | Forbidden - trying to access someone else's task |
| 404 | Not Found - task or user doesn't exist |
| 500 | Internal Server Error - something broke on the server |

---

## Notes

- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt (salt rounds: 10)
- Task ownership is enforced - you can only see/edit/delete your own tasks
- MongoDB ObjectId is used as task ID in routes

---

*Built for internship submission - B.Tech IT Final Year*
