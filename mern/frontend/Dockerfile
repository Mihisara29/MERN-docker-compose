# Use official Node.js image
FROM node:18.19.1

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other frontend files
COPY . .

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 5173

# Run Frontend
CMD ["npm","run","dev"]

