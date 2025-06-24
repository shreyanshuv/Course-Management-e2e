# Build stage
FROM maven:3.9-amazoncorretto-17 AS builder

# Set working directory
WORKDIR /build

# Copy maven files first for better caching
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline

# Copy source code
COPY src src

# Package the application
RUN mvn package -DskipTests

# Runtime stage
FROM amazoncorretto:17-alpine

# Add necessary tools and time sync
RUN apk add --no-cache \
    curl \
    bash \
    wget \
    maven \
    openntpd && \
    # Configure NTP servers
    echo "server 0.pool.ntp.org" >> /etc/ntpd.conf && \
    echo "server 1.pool.ntp.org" >> /etc/ntpd.conf

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -S spring && \
    adduser -S spring -G spring && \
    mkdir -p /app/data && \
    chown -R spring:spring /app && \
    chmod -R 755 /app

# Copy jar from build stage
COPY --from=builder /build/target/course-management-0.0.1-SNAPSHOT.jar app.jar

# Copy scripts
COPY run-tests.sh test-api.sh startup.sh ./
RUN chmod +x ./*.sh && \
    chown -R spring:spring .

# Use non-root user
USER spring:spring

# Expose port
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/courses || exit 1

# Environment variables
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms512m -Xmx1024m" \
    SQLITE_DB_PATH="/app/data/course_management.db" \
    PATH="/usr/bin:${PATH}"

# Run the application
ENTRYPOINT ["/bin/bash", "/app/startup.sh"] 