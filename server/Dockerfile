# Use lightweight node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Copy rest of source code
COPY . .

# Expose port
EXPOSE 5002

# Start the app
CMD ["node", "server.js"]
