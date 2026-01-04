# Use Node.js 18 alpine as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Create directories for uploads and outputs
RUN mkdir -p uploads outputs

# Expose the backend port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
