# Use Node.js
FROM node:22 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript files
RUN npm run build
RUN ls -la /app/dist


# Stage 2: Run
FROM node:22

WORKDIR /app

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Only copy compiled output and production dependencies
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
# Expose app port
EXPOSE 5000

# Start built JavaScript output
CMD ["sh", "./wait-for-it.sh", "mysql:3306", "--", "node", "dist/index.js"]

