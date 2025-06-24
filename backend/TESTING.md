# Course Management System - Testing Guide

## Prerequisites

- Java 17 or higher
- Maven
- Postman or cURL for API testing
- SQLite (included in the project)
- Docker and Docker Compose (for containerized testing)

## Test Environment Setup

### Local Development
1. Navigate to the backend directory:

```bash
cd course-management/backend
```

2. Start the Spring Boot application:

```bash
mvn spring-boot:run
```

### Docker Environment
1. Start all services:

```bash
docker-compose up
```

The application will start on `http://localhost:8080`

## Automated Testing

### Running All Tests
```bash
# Make the test script executable
chmod +x run-tests.sh

# Run the tests
./run-tests.sh
```

The script will:
1. Start the application if not running
2. Execute all test scenarios
3. Generate a detailed report in `test_report.md`
4. Create a timestamped archive of test results

### Test Results
Test results are stored in:
- `test_report.md`: Detailed test report
- `test_responses/`: Directory containing all API responses
- `test_results_TIMESTAMP.tar.gz`: Archived test results

## Manual Testing Guide

### 1. Course Management

#### Create Basic Course
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "CS101",
    "title": "Introduction to Programming",
    "description": "Basic programming concepts",
    "prerequisites": []
  }'
```
Expected: 201 Created

#### Create Course with Prerequisites
```bash
# First create prerequisite
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "MATH101",
    "title": "Basic Mathematics",
    "description": "Fundamental mathematics concepts",
    "prerequisites": []
  }'

# Create course with prerequisite
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "CS201",
    "title": "Data Structures",
    "description": "Advanced programming concepts",
    "prerequisites": [
      {
        "courseId": "CS101"
      }
    ]
  }'
```
Expected: 201 Created

#### List All Courses
```bash
curl http://localhost:8080/api/courses
```
Expected: 200 OK

#### Get Course by ID
```bash
curl http://localhost:8080/api/courses/1
```
Expected: 200 OK

#### Delete Course
```bash
curl -X DELETE http://localhost:8080/api/courses/1
```
Expected: 
- 200 OK if successful
- 409 Conflict if course is a prerequisite

### 2. Course Instance Management

#### Create Course Instance
```bash
curl -X POST http://localhost:8080/api/instances \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "CS101",
    "year": 2024,
    "semester": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-05-31"
  }'
```
Expected: 201 Created

#### Get Instances by Year/Semester
```bash
curl http://localhost:8080/api/instances/2024/1
```
Expected: 200 OK

#### Get Specific Instance
```bash
curl http://localhost:8080/api/instances/2024/1/CS101
```
Expected: 200 OK

#### Delete Instance
```bash
curl -X DELETE http://localhost:8080/api/instances/2024/1/CS101
```
Expected: 200 OK

## Error Test Cases

### 1. Invalid Course Creation
```bash
# Missing required fields
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "",
    "title": "",
    "description": ""
  }'
```
Expected: 400 Bad Request

### 2. Invalid Prerequisites
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "CS301",
    "title": "Advanced Programming",
    "description": "Expert level programming",
    "prerequisites": [
      {
        "courseId": "INVALID101"
      }
    ]
  }'
```
Expected: 400 Bad Request

### 3. Delete Course with Dependencies
```bash
# Try to delete CS101 which is a prerequisite for CS201
curl -X DELETE http://localhost:8080/api/courses/1
```
Expected: 409 Conflict

### 4. Invalid Course Instance
```bash
curl -X POST http://localhost:8080/api/instances \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "INVALID101",
    "year": 2024,
    "semester": 3,
    "startDate": "2024-01-01",
    "endDate": "2024-05-31"
  }'
```
Expected: 400 Bad Request

## Using Swagger UI

1. Open `http://localhost:8080/swagger-ui.html`
2. Test endpoints interactively
3. View request/response schemas
4. Try out different scenarios

## Database Verification

```bash
sqlite3 course_management.db
```

Useful queries:
```sql
-- List all courses
SELECT * FROM course;

-- View prerequisites
SELECT c1.course_id as course, c2.course_id as prerequisite 
FROM course_prerequisites cp 
JOIN course c1 ON cp.course_id = c1.id 
JOIN course c2 ON cp.prerequisite_id = c2.id;

-- View course instances
SELECT c.course_id, ci.year, ci.semester, ci.start_date, ci.end_date 
FROM course_instance ci 
JOIN course c ON ci.course_id = c.id;
```

## Common Issues and Solutions

1. Application Not Starting
   - Check if port 8080 is free
   - Verify database file permissions
   - Check Java version

2. Test Failures
   - Verify application is running
   - Check database state
   - Review error messages in test report

3. Database Issues
   - Check file permissions
   - Verify schema matches entities
   - Check for foreign key violations

## Continuous Integration

The test script is integrated with GitHub Actions:
- Runs on every push and pull request
- Generates test reports
- Validates API functionality
- Checks code quality

For detailed CI results, check the GitHub Actions tab in the repository.
