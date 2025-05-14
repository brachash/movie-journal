Movie Journal Application
Description
A personal movie journal application that allows users to search for movies using the TMDB API, add them to their personal space, manage watch status, rate and comment on movies, and mark favorites. The application includes user authentication with JWT, a React + TypeScript frontend, and a Node.js + Express + TypeScript backend with MongoDB.
Setup and Execution Instructions

Prerequisites: Ensure Docker and Docker Compose are installed.
Clone the Repository:git clone <repository-url>
cd movie-journal

Environment Variables:
Create a .env file in the backend directory with:MONGO_URI=mongodb://mongo:27017/movie-journal
JWT_SECRET=your_jwt_secret_key_12345
TMDB_API_KEY=your_tmdb_api_key_here

Obtain a TMDB API key from TMDB.

Run the Application:docker-compose up --build

Access the Application:
Frontend: http://localhost:3000
Backend: http://localhost:5000

Integrated APIs

TMDB API: Used for searching movies and retrieving movie details.

Project Structure

frontend/: React + TypeScript frontend.
backend/: Node.js + Express + TypeScript backend.
docker-compose.yml: Docker configuration for running the application.

Notes

The application is containerized using Docker to ensure easy setup.
TypeScript is used for type safety and better code maintainability.
Tailwind CSS is used for responsive and clean UI design.
