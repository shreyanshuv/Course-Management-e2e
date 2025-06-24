# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Add necessary tools and time sync
RUN apk add --no-cache \
    curl \
    bash \
    wget \
    openntpd && \
    # Configure NTP servers
    echo "server 0.pool.ntp.org" >> /etc/ntpd.conf && \
    echo "server 1.pool.ntp.org" >> /etc/ntpd.conf

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user
RUN addgroup -S nginx-group && \
    adduser -S nginx-user -G nginx-group && \
    chown -R nginx-user:nginx-group /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Use non-root user
USER nginx-user:nginx-group

# Expose port
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 