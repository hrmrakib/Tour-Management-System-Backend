# ==========================================
# Stage 1: Build the TypeScript code
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies like typescript)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code (assumes you have a "build" script in package.json)
RUN npm run build

# ==========================================
# Stage 2: Run the Production Node Server
# ==========================================
FROM node:20-alpine AS production

# Set environment to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies (keeps image small)
RUN npm install --omit=dev

# Copy the compiled JavaScript code from the builder stage
COPY --from=builder /app/dist ./dist

# Expose your backend port (match the port your Express app uses, e.g., 5000)
EXPOSE 5000

# Start the application (assumes your compiled entry point is in dist/server.js)
CMD ["node", "dist/server.js"]