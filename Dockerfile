# Use Node.js as our base image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if exists)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Copy .env file if it exists
COPY .env* ./

# Expose the port your dev server runs on
EXPOSE 5173

# Start the dev server
CMD ["pnpm", "run", "serve", "--host", "0.0.0.0"]