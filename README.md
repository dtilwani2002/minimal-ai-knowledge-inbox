# Minimal AI Knowledge Inbox

A full-stack application that allows users to store knowledge items and query them using an AI-powered interface.

## Features

- Add and manage knowledge items
- Query stored knowledge using AI
- Responsive UI for desktop, tablet, and mobile devices
- Light and Dark theme support
- Clean and intuitive component-based interface

## Tech Stack

### Frontend
- React
- Vite
- CSS
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

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
OPENAI_API_KEY=YOUR_API_KEY
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```
http://localhost:5173
```

The backend runs at:

```
http://localhost:5000
```

## Design Decisions

- Separated frontend and backend for better maintainability and scalability.
- Built the UI using reusable React components.
- Designed a responsive interface to ensure usability across desktop, tablet, and mobile devices.
- Implemented Light and Dark themes to improve accessibility and user experience.
- Kept the backend modular with REST APIs for easier extension.

## Tradeoffs

- Prioritized core functionality and clean architecture over advanced animations.
- Uses local/in-memory storage (or your current storage approach) instead of a production database.
- Authentication and authorization were not included since they were outside the assignment scope.

## Future Improvements

- User authentication
- Persistent database
- AI response streaming
- Search history
- Automated testing
- Containerization with Docker
