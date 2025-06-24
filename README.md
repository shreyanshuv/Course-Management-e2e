# Course Management System

A comprehensive course management system, featuring a Spring Boot backend and React frontend. This system allows for efficient management of courses, their prerequisites, and course delivery instances.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Detailed Documentation](#detailed-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Common Commands](#common-commands)
- [Debugging Guide](#debugging-guide)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Project Overview

The Course Management System consists of two main components:

- **Backend**: Spring Boot application providing REST APIs
- **Frontend**: React-based web interface

### Repository Structure

```
course-management/
├── backend/               # Spring Boot backend
│   ├── src/              # Source code
│   ├── pom.xml           # Maven dependencies
│   └── README.md         # Backend documentation
├── frontend/             # React frontend
│   ├── src/              # Source code
│   ├── package.json      # NPM dependencies
│   └── README.md         # Frontend documentation
└── docker-compose.yaml   # Docker composition
```

## Architecture

### Backend Architecture

- **Framework**: Spring Boot 3.x
- **Database**: SQLite
- **API Documentation**: OpenAPI/Swagger
- **Testing**: JUnit, MockMvc
- [Detailed Backend Documentation](backend/README.md)

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI
- **State Management**: React Hooks
- **API Integration**: Axios
- [Detailed Frontend Documentation](frontend/README.md)

## Features

### Course Management

- Create and manage courses
- Define course prerequisites
- View course listings and details
- Validate prerequisite relationships

### Course Instance Management

- Create course instances for specific semesters
- Assign instructors
- Manage academic periods
- View instance details

### API Documentation

- Interactive Swagger UI
- Comprehensive API documentation
- Request/response examples
- Authentication details

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Quick Start

1. Clone the repository:

```bash
git clone <repository-url>
cd course-management
```

2. Set your Docker Hub username:

```bash
export DOCKER_USERNAME=your-dockerhub-username
```

3. Start the application:

```bash
docker-compose up --build
```

4. Access the applications:

- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Running Individual Components

#### Backend Only

```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend Only

```bash
cd frontend
npm install
npm start
```

## Environment Setup

### Required Environment Variables

1. **Docker Configuration**
```bash
# Required for Docker operations
export DOCKER_USERNAME=your-dockerhub-username

# Verify the setting
echo $DOCKER_USERNAME
```

You can add this to your shell's configuration file (`.bashrc`, `.zshrc`, etc.):
```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'export DOCKER_USERNAME=your-dockerhub-username' >> ~/.zshrc
source ~/.zshrc
```

2. **Application Variables**
```bash
# Backend
export SQLITE_DB_PATH=./course_management.db
export SPRING_PROFILES_ACTIVE=dev

# Frontend
export REACT_APP_API_URL=http://localhost:8080
export REACT_APP_DEBUG=true
```

### Environment Files

1. **Backend Environment** (`backend/.env`)
```properties
SQLITE_DB_PATH=./course_management.db
SPRING_PROFILES_ACTIVE=dev
```

2. **Frontend Environment** (`frontend/.env`)
```properties
REACT_APP_API_URL=http://localhost:8080
REACT_APP_DEBUG=true
```

### Docker Environment

The system uses Docker environment variables for container configuration:

1. **Required Variables**
   - `DOCKER_USERNAME`: Your Docker Hub username (required for image tagging)

2. **Optional Variables**
   - `COMPOSE_PROJECT_NAME`: Custom project name (defaults to 'course-management')
   - `DOCKER_BUILDKIT`: Enable BuildKit (recommended: set to 1)

### Setting Up Environment

1. **First Time Setup**
```bash
# Set Docker username
export DOCKER_USERNAME=your-dockerhub-username

# Verify environment
docker-compose config

# Start services with environment
docker-compose up --build
```

2. **Development Environment**
```bash
# Development mode
export SPRING_PROFILES_ACTIVE=dev
export REACT_APP_DEBUG=true

# Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

3. **Production Environment**
```bash
# Production mode
export SPRING_PROFILES_ACTIVE=prod
export REACT_APP_DEBUG=false

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### Troubleshooting Environment Issues

1. **Docker Username Not Set**
```bash
# Error: DOCKER_USERNAME not set
echo "DOCKER_USERNAME not set. Please set it:"
export DOCKER_USERNAME=your-dockerhub-username
```

2. **Verify Environment**
```bash
# Check all environment variables
env | grep DOCKER
env | grep REACT_APP
env | grep SPRING

# Check Docker configuration
docker info
```

3. **Reset Environment**
```bash
# Clear and reset environment
unset DOCKER_USERNAME
unset SPRING_PROFILES_ACTIVE
unset REACT_APP_DEBUG

# Set fresh environment
export DOCKER_USERNAME=your-dockerhub-username
export SPRING_PROFILES_ACTIVE=dev
```

## Detailed Documentation

### Backend Documentation

The backend documentation covers:

- API endpoints and usage
- Database schema
- Authentication
- Testing procedures
- [View Backend README](backend/README.md)

### Frontend Documentation

The frontend documentation includes:

- Component architecture
- State management
- API integration
- Testing strategy
- [View Frontend README](frontend/README.md)

## Development

### Backend Development

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### API Testing

```bash
cd backend
./run-tests.sh
```

## Testing

### Running Tests

#### Backend Tests

```bash
cd backend
./mvnw test
```

#### Frontend Tests

```bash
cd frontend
npm test
```

### Test Coverage

- Backend: JUnit test coverage
- Frontend: Jest/React Testing Library
- Integration tests via API test suite

## Deployment

### Docker Deployment

1. Build and run with Docker Compose:

```bash
docker-compose up --build
```

2. Push to Docker Hub:

```bash
docker-compose push
```

### Configuration

#### Environment Variables

- `DOCKER_USERNAME`: Your Docker Hub username
- `SPRING_PROFILES_ACTIVE`: Spring Boot profile (default: prod)
- `SQLITE_DB_PATH`: Database file location

#### Ports

- Frontend: 80
- Backend: 8080

### Health Checks

- Backend: http://localhost:8080/api/courses
- Frontend: http://localhost

## Common Commands

### Docker Compose Operations

```bash
# Start all services
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d --build

# Stop all services
docker-compose down

# Force stop and remove all containers
docker-compose down -v --remove-orphans

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Rebuild and restart specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Development Commands

```bash
# Start backend only
cd backend
./mvnw spring-boot:run

# Start frontend only
cd frontend
npm install
npm start

# Run backend tests
cd backend
./mvnw test

# Run frontend tests
cd frontend
npm test
```

## Debugging Guide

### Common Issues and Solutions

1. **Database Issues**
```bash
# Reset database (from project root)
rm -f backend/course_management.db
docker-compose down -v
docker-compose up --build
```

2. **Port Conflicts**
```bash
# Check ports in use
lsof -i :8080  # Check backend port
lsof -i :80    # Check frontend port

# Kill process using port
kill -9 $(lsof -t -i :8080)
kill -9 $(lsof -t -i :80)
```

3. **Container Issues**
```bash
# Remove all containers and volumes
docker-compose down -v --remove-orphans
docker system prune -a --volumes

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up --build
```

### Logging Levels

1. **Backend Logging**
   - Edit `backend/src/main/resources/application.properties`:
   ```properties
   # Debug mode
   logging.level.com.iitb=DEBUG
   logging.level.org.springframework=DEBUG
   
   # Production mode
   logging.level.com.iitb=INFO
   logging.level.org.springframework=INFO
   ```

2. **Frontend Logging**
   - Set environment variable:
   ```bash
   # Development
   REACT_APP_DEBUG=true npm start
   
   # Production
   REACT_APP_DEBUG=false npm start
   ```

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost
```

### Common Error Messages

1. **500 Internal Server Error**
   - Check backend logs: `docker-compose logs -f backend`
   - Verify database connection
   - Check application.properties configuration

2. **404 Not Found**
   - Verify API endpoints
   - Check frontend API configuration
   - Ensure services are running

3. **CORS Issues**
   - Verify WebConfig.java configuration
   - Check frontend API base URL
   - Ensure proper headers in nginx.conf

### Performance Monitoring

1. **Backend Metrics**
   ```bash
   # View JVM metrics
   curl http://localhost:8080/actuator/metrics
   
   # View specific metric
   curl http://localhost:8080/actuator/metrics/http.server.requests
   ```

2. **Container Stats**
   ```bash
   # View container resource usage
   docker stats
   
   # View specific container
   docker stats course-management-backend
   docker stats course-management-frontend
   ```

### Development Tips

1. **Hot Reload**
   - Backend: Enable devtools in pom.xml
   - Frontend: Already enabled with react-scripts

2. **Database Management**
   - Use SQLite browser for database inspection
   - Backup database: `cp backend/course_management.db backup.db`
   - Restore database: `cp backup.db backend/course_management.db`

3. **Clean Restart**
   ```bash
   # Full system restart
   docker-compose down -v
   rm -f backend/course_management.db
   docker system prune -a --volumes
   docker-compose up --build
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spring Boot and React communities
- Contributors and reviewers
