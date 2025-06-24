# Course Management System Backend

A Spring Boot-based REST API service for managing courses and their instances at IIT Bombay. This application provides a robust backend for course management, handling course prerequisites, and course delivery instances.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [Database Schema](#database-schema)
- [Testing](#testing)

## Features

### Course Management
- Create courses with unique course IDs
- Define course prerequisites with validation
- List all courses with their prerequisites
- Delete courses with dependency checks

### Course Instance Management
- Create course delivery instances for specific years and semesters
- List instances by year and semester
- Delete course instances
- Validate course existence and prevent duplicates

## Technology Stack

- **Spring Boot 3.x**: Modern, production-ready framework for building REST APIs
- **SQLite Database**: Lightweight, file-based database for easy deployment
- **JPA/Hibernate**: Robust ORM for database operations
- **OpenAPI/Swagger**: API documentation and testing
- **JUnit/MockMvc**: Comprehensive testing framework

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/iitb/coursemanagement/
│   │   │       ├── config/
│   │   │       │   ├── OpenApiConfig.java
│   │   │       │   └── WebConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── CourseController.java
│   │   │       │   └── CourseInstanceController.java
│   │   │       ├── model/
│   │   │       │   ├── Course.java
│   │   │       │   └── CourseInstance.java
│   │   │       ├── repository/
│   │   │       │   ├── CourseRepository.java
│   │   │       │   └── CourseInstanceRepository.java
│   │   │       └── CourseManagementApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
├── pom.xml
└── course_management.db
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- SQLite 3

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd course-management/backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080/api`.
Swagger UI documentation will be available at `http://localhost:8080/swagger-ui.html`.

## API Documentation

### Course Endpoints

#### Create Course
- **POST** `/api/courses`
- Creates a new course with optional prerequisites
- Prerequisites are validated to ensure they exist
```json
{
  "courseId": "CS101",
  "title": "Introduction to Programming",
  "description": "Basic programming concepts",
  "prerequisites": []
}
```

#### Get All Courses
- **GET** `/api/courses`
- Returns list of all courses with their prerequisites

#### Get Course by ID
- **GET** `/api/courses/{id}`
- Returns details of a specific course

#### Delete Course
- **DELETE** `/api/courses/{id}`
- Deletes a course if it's not a prerequisite for other courses

### Course Instance Endpoints

#### Create Instance
- **POST** `/api/instances`
- Creates a new course delivery instance
```json
{
  "courseId": "CS101",
  "year": 2024,
  "semester": 1,
  "instructor": "Dr. Smith"
}
```

#### Get Instances by Year/Semester
- **GET** `/api/instances/{year}/{semester}`
- Lists all course instances for a specific year and semester

#### Delete Instance
- **DELETE** `/api/instances/{year}/{semester}/{courseId}`
- Removes a specific course instance

## Design Decisions

### 1. Architecture
- **REST Architecture**: Chosen for:
  - Stateless communication
  - Standard HTTP methods
  - Clear resource hierarchy
  - Easy client integration

### 2. Data Model
- **Course Entity**:
  - Unique course ID constraint
  - Many-to-many self-referential relationship for prerequisites
  - One-to-many relationship with instances
- **Course Instance Entity**:
  - Composite uniqueness (year, semester, course)
  - Strong validation rules
  - Efficient querying capabilities

### 3. Database Choice
- **SQLite**:
  - File-based for easy deployment
  - ACID compliance
  - No separate server needed
  - Suitable for moderate data volume

### 4. Security & Validation
- Input validation at controller level
- Business rule validation in service layer
- CORS configuration for frontend access
- Error handling with appropriate HTTP status codes

## Database Schema

### Course Table
```sql
CREATE TABLE course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE course_prerequisites (
    course_id INTEGER,
    prerequisite_id INTEGER,
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (prerequisite_id) REFERENCES course(id)
);
```

### Course Instance Table
```sql
CREATE TABLE course_instance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(id),
    UNIQUE(year, semester, course_id)
);
```

## Testing

### Unit Tests
- Controller layer tests with MockMvc
- Repository layer tests with H2 database
- Service layer tests with Mockito

### Integration Tests
- End-to-end API tests
- Database integration tests
- CORS configuration tests

### Test Coverage
- Controller layer: 90%+
- Service layer: 85%+
- Repository layer: 80%+

### Test Execution
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=CourseControllerTest

# Generate test coverage report
mvn verify
```

## Error Handling

### Global Exception Handler
- Custom exception classes for business logic
- Appropriate HTTP status codes
- Consistent error response format
```json
{
  "status": 400,
  "message": "Invalid request",
  "details": "Course with ID CS101 already exists"
}
```

## Future Improvements

1. **Performance**
   - Implement caching for frequently accessed data
   - Add pagination for large result sets
   - Optimize database queries

2. **Features**
   - Add user authentication/authorization
   - Support for course materials
   - Audit logging
   - Batch operations

3. **Monitoring**
   - Add health check endpoints
   - Implement metrics collection
   - Add logging for debugging
   - Performance monitoring

4. **Deployment**
   - Docker containerization
   - CI/CD pipeline setup
   - Environment-specific configurations
   - Backup strategy 