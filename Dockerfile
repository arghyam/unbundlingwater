# Use an official Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Install an HTTP server to serve the app
RUN npm install -g serve

# Set the environment variable to be used by the HTTP server
ENV REACT_APP_ENV=production

# Expose the port on which the app will run
EXPOSE 5000

# Command to serve the app
CMD ["serve", "-s", "build", "-l", "5000"]
