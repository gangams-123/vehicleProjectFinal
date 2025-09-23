# Stage 1: Build Angular app
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm cache clean --force

RUN npm install

# Copy all project files
COPY . .

# Build Angular app for production
RUN npm run build 

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine

# Copy built Angular files to NGINX's public folder
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
