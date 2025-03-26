# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install all dependencies, including devDependencies (needed for TypeScript compilation)
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Remove devDependencies for a smaller production image
RUN npm prune --production

# Ensure the /src/temp directory exists
RUN mkdir -p src/temp

# Expose the port your app runs on
EXPOSE 4000

# Define environment variables (optional, for environment-specific configuration)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
