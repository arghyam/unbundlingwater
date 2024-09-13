# Stage 1: Build React app
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for both frontend and backend
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies for both frontend and backend
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy the rest of the application code
COPY frontend ./frontend
COPY backend ./backend

# Build the React app
RUN cd frontend && npm run build

# Expose the port the Express app runs on
EXPOSE 3000

# Set the working directory to the backend folder
WORKDIR /app/backend

# Start the Express server
CMD ["node", "app.js"]