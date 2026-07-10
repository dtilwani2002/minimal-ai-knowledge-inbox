# Minimal AI Knowledge Inbox

A full-stack application that allows users to store knowledge items and query them using an AI-powered interface.

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Node.js
- Express

## Project Structure

```
backend/
frontend/
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/dtilwani2002/minimal-ai-knowledge-inbox.git
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
OPENAI_API_KEY=YOUR_KEY
PORT=5000
```

Run:

```bash
npm start
```

(or `npm run dev` if you're using nodemon)

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

## Design Decisions

- React + Vite for a lightweight frontend.
- Express.js for REST API development.
- Component-based architecture for better maintainability.
- Backend separated from frontend to allow independent deployment.

## Tradeoffs

- Uses in-memory/local storage instead of a production database.
- Focused on functionality over UI polish.
- Minimal authentication/security since it was outside the assignment scope.

## Future Improvements

- User authentication
- Persistent database
- Better error handling
- Streaming AI responses
- Unit and integration tests