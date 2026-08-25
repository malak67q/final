# MetroSync

Real-time metro information system built with Node.js, Express, MongoDB, JWT, and Socket.IO.

## Tasks

### Task 1 — Project Setup & Database
- MongoDB connection and environment variables
- Station database seeding
- `/health` endpoint

### Task 2 — Stations API
- `GET /api/v1/stations`
- Stations sorted by line and order
- Route, controller, and service structure

### Task 3 — Admin Authentication
- Admin login with bcrypt
- JWT authentication
- Login validation and rate limiting

### Task 4 — Protected Routes
- Admin authentication middleware
- Protected announcement creation
- Public station and announcement reads

### Task 5 — Announcements API
- Create and retrieve announcements
- Pagination and filtering
- Input validation
- Central error handling

### Task 6 — Real-Time Socket.IO
- Station rooms
- Live viewer counts
- Real-time announcement broadcasting

### Task 7 — Testing & Deployment
- Jest and Supertest integration tests
- API deployment
- MongoDB production database
- Live `/health` endpoint

### Task 8 — Verification & Demo
- Postman collection for the main API endpoints
- Saved request examples
- Passenger/admin two-tab real-time demonstration

## Main Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/v1/auth/login` | Admin login |
| GET | `/api/v1/stations` | Get all stations |
| GET | `/api/v1/stations/:id/announcements` | Get announcements |
| POST | `/api/v1/stations/:id/announcements` | Create announcement |

## Technologies

Node.js • Express • MongoDB • Mongoose • JWT • bcrypt • Socket.IO • Jest • Supertest • Postman

## Security

`.env` contains private credentials and must not be uploaded or committed to GitHub.
