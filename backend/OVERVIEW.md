# Course Management System

A comprehensive course management system built for IIT Bombay, featuring a Spring Boot backend API and React frontend (in development). The system allows for efficient management of courses, their prerequisites, and course instances.

## Project Overview

The Course Management System is designed to:

- Manage course information and relationships
- Handle course prerequisites as actual course relationships
- Track course instances (specific deliveries of courses)
- Provide a RESTful API for course management operations

## Technology Stack

### Backend

- Java 17
- Spring Boot 3.x
- SQLite Database
- Spring Data JPA
- SpringDoc OpenAPI (Swagger)

### Frontend (Planned)

- React.js
- TypeScript
- Material-UI/Tailwind CSS

## Project Structure

```
course-management/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/iitb/coursemanagement/
│   │   │   │       ├── controller/
│   │   │   │       │   └── CourseController.java
│   │   │   │       ├── model/
│   │   │   │       │   ├── Course.java
│   │   │   │       │   └── CourseInstance.java
│   │   │   │       └── repository/
│   │   │   │           ├── CourseRepository.java
│   │   │   │           └── CourseInstanceRepository.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   ├── pom.xml
│   └── course_management.db
└── frontend/
    └── (React application - Coming soon)
```

## Core Components

### Models

1. Course

- Represents a course in the system
- Properties:
  - id (Long): Unique identifier
  - courseId (String): Course code (e.g., "CS101")
  - title (String): Course title
  - description (String): Course description
  - prerequisites (List`<Course>`): List of prerequisite courses

2. CourseInstance

- Represents a specific delivery of a course
- Properties:
  - id (Long): Unique identifier
  - course (Course): Associated course
  - semester (String): Semester of delivery
  - startDate (Date): Course start date
  - endDate (Date): Course end date

### Repositories

1. CourseRepository

- Handles database operations for Course entities
- Extends JpaRepository
- Provides custom query methods for course management

2. CourseInstanceRepository

- Manages CourseInstance entity persistence
- Extends JpaRepository
- Handles course delivery scheduling and tracking

### Controllers

CourseController

- REST endpoints for course management
- Implements CRUD operations
- Handles prerequisite relationships
- Manages course instances

## API Endpoints

### Course Management

- `POST /api/courses`: Create new course
- `GET /api/courses`: List all courses
- `GET /api/courses/{id}`: Get course by ID
- `PUT /api/courses/{id}`: Update course
- `DELETE /api/courses/{id}`: Delete course

### Course Instance Management

- `POST /api/courses/{id}/instances`: Create course instance
- `GET /api/courses/{id}/instances`: List course instances
- `GET /api/courses/instances/{id}`: Get instance by ID

## Database Schema

```sql
CREATE TABLE course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE course_prerequisites (
    course_id BIGINT NOT NULL,
    prerequisite_id BIGINT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (prerequisite_id) REFERENCES course(id)
);

CREATE TABLE course_instance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id BIGINT NOT NULL,
    semester VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(id)
);
```

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd course-management
```

2. Start the backend:

```bash
cd backend
mvn spring-boot:run
```

3. Access the API documentation:

- Open `http://localhost:8080/swagger-ui.html` in your browser

## Testing

Refer to [TESTING.md](backend/TESTING.md) for detailed testing instructions and API usage examples.

## Future Enhancements

1. Frontend Development

- React-based user interface
- Modern, responsive design
- Intuitive course management workflows

2. Additional Features

- User authentication and authorization
- Student enrollment management
- Course material management
- Grade tracking
- Attendance management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
