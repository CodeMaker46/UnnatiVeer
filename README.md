# Sports Connect Platform

A MERN stack application connecting athletes, organizations, and donors.

## Features

- Multi-user registration system (Organizations, Athletes, Donors)
- Organization features:
  - Create events
  - Offer travel allowances
  - Provide sponsorships
- Athlete features:
  - Profile management with achievements
  - Apply for sponsorships/events
  - Request travel allowances
- Donor features:
  - View and support athletes/events

## Tech Stack

- MongoDB - Database
- Express.js - Backend framework
- React.js - Frontend library
- Node.js - Runtime environment

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Create a `.env` file in the backend directory with your MongoDB connection string
4. Start the application:
   ```
   # Start backend
   cd backend && npm start
   
   # Start frontend (in a new terminal)
   cd frontend && npm start
   ```

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Express backend API
- `/backend/models` - Database models
- `/backend/routes` - API routes
