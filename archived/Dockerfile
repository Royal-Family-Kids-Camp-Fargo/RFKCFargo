# Use a Node.js image to build the frontend
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for both frontend and backend
# NOTE: this is not optimal, we should not have to copy the package.json for both frontend and backend
COPY packages/server/package.json .

# Install dependencies for both  backend
RUN npm install

# Copy the rest of the application code
COPY packages/server .

# Use a Node.js image to run both frontend and backend
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy the backend code
COPY --from=build /app /app

# Expose the necessary port
EXPOSE 5001

# Start the backend
CMD ["npm", "start"]
