# Swagger UI Testing Guide - Course Management System

## Accessing Swagger UI

1. Start the Spring Boot application:
```bash
mvn spring-boot:run
```

2. Open your browser and navigate to:
```
http://localhost:8080/swagger-ui/index.html
```

[Screenshot: Swagger UI Homepage]
*Add screenshot showing the main Swagger UI interface with Course Management endpoints*

## Understanding the Interface

The Swagger UI interface is focused on Course Management functionality, providing a clean and focused view of course-related operations.

### API Organization

The interface shows endpoints related to Course Management, which includes:
- Course creation and modification
- Course retrieval
- Course deletion
- Prerequisites management

### Available Operations

Our API provides the following core operations:

```yaml
Course Management:
  - POST /api/courses     # Create a new course
  - GET /api/courses      # Get all courses
  - GET /api/courses/{id} # Get a specific course
  - DELETE /api/courses/{id} # Delete a course
```

## Testing Scenarios

### Course Management

#### 1. Create New Course (POST /api/courses)

[Screenshot: Create Course Endpoint]
*Add screenshot showing the POST /api/courses endpoint expanded*

Test Cases:
1. Basic Course Creation
```json
{
  "courseId": "CS101",
  "title": "Introduction to Programming",
  "description": "Basic programming concepts",
  "prerequisites": []
}
```

2. Course with Prerequisites
```json
{
  "courseId": "CS201",
  "title": "Data Structures",
  "description": "Advanced programming concepts",
  "prerequisites": [
    {
      "courseId": "CS101"
    }
  ]
}
```

3. Invalid Course (Missing Required Fields)
```json
{
  "courseId": "",
  "title": "",
  "description": "This should fail"
}
```

Expected Responses:
- 200: Course created successfully
- 400: Invalid request (missing fields or invalid prerequisites)

[Screenshot: Course Creation Response]
*Add screenshot showing a successful course creation response*

#### 2. Get All Courses (GET /api/courses)

[Screenshot: Get All Courses]
*Add screenshot showing the GET /api/courses endpoint and response*

Test Cases:
1. Empty Database
   - Expected: Empty array `[]`
2. Multiple Courses
   - Expected: Array of course objects with their prerequisites
3. Courses with Prerequisites
   - Expected: Nested prerequisite information included in response

#### 3. Get Course by ID (GET /api/courses/{id})

[Screenshot: Get Course by ID]
*Add screenshot showing the GET /api/courses/{id} endpoint*

Test Cases:
1. Existing Course ID
   - Expected: 200 OK with course details
2. Non-existent Course ID
   - Expected: 404 Not Found
3. Invalid ID Format
   - Expected: 400 Bad Request

#### 4. Delete Course (DELETE /api/courses/{id})

[Screenshot: Delete Course]
*Add screenshot showing the DELETE /api/courses/{id} endpoint*

Test Cases:
1. Delete Course without Prerequisites
   - Expected: 200 OK
2. Delete Course that is a Prerequisite
   - Expected: 409 Conflict with error message
3. Delete Non-existent Course
   - Expected: 404 Not Found

## Best Practices

1. Prerequisites Management:
   - Always verify that prerequisite courses exist before creating dependencies
   - Check for circular dependencies
   - Ensure prerequisites are valid courses

2. Course IDs:
   - Use consistent format (e.g., "CS101", "MATH201")
   - Ensure uniqueness
   - Keep them meaningful and related to the course content

3. Testing Flow:
   1. Create basic courses first
   2. Create courses with prerequisites
   3. Test retrieval operations
   4. Test delete operations
   5. Verify prerequisite relationships

## Error Handling

Common error responses:
- 400 Bad Request: Invalid input data
- 404 Not Found: Resource doesn't exist
- 409 Conflict: Cannot delete course (prerequisite dependency)

## Notes

- The API focuses solely on course management and prerequisites
- All operations are synchronous and return immediate responses
- Prerequisites are validated during course creation
- Deletion checks for prerequisite dependencies before removing a course

## Filter by Tag Feature

The "Filter by tag" toggle at the top of the Swagger UI interface is a powerful organization tool that:

1. Purpose:
   - Groups related endpoints together
   - Makes API documentation more readable
   - Helps find specific functionality quickly

2. Tags in Our API:
   - Course Controller: All course-related endpoints
   - Course Instance Controller: All instance-related endpoints

3. Usage:
   - When enabled (default): Shows endpoints grouped by their controller/tag
   - When disabled: Shows all endpoints in a flat list
   - Use the search bar with tags for precise filtering

[Screenshot: Filter by Tag]
*Add screenshot showing the Filter by tag toggle and its effects*

4. Benefits:
   - Better organization of large APIs
   - Easier navigation between related endpoints
   - Clearer documentation structure

5. Our Tag Structure:
```yaml
course-controller:
  - POST /api/courses
  - GET /api/courses
  - GET /api/courses/{id}
  - DELETE /api/courses/{id}

course-instance-controller:
  - POST /api/instances
  - GET /api/instances/{year}/{semester}
  - GET /api/instances/{year}/{semester}/{courseId}
  - DELETE /api/instances/{year}/{semester}/{courseId}
```

[Screenshot: Tag Groups]
*Add screenshot showing the grouped endpoints under each tag*

## Available API Groups

### 1. Course Controller
Manages core course operations including creation, retrieval, and deletion.

### 2. Course Instance Controller
Handles course delivery instances including scheduling and management.

## Testing Workflow

### 1. Course Creation and Prerequisites

1. Create Basic Course (CS101)
   - Use POST /api/courses
   - Verify with GET /api/courses

[Screenshot: Course Creation Workflow]
*Add screenshot showing the sequence of operations*

2. Create Prerequisite Relationship
   - Create another course (CS201)
   - Add CS101 as prerequisite
   - Verify with GET /api/courses/{id}

[Screenshot: Prerequisites Verification]
*Add screenshot showing the prerequisite relationship*

### 2. Course Instance Management

1. Create Course Instance
   - Use POST /api/instances
   - Verify with GET /api/instances/{year}/{semester}

[Screenshot: Instance Management]
*Add screenshot showing the instance creation and verification*

2. Update and Delete Operations
   - Create multiple instances
   - Verify listings
   - Delete specific instances

[Screenshot: Instance Operations]
*Add screenshot showing multiple instance operations*

## Response Codes

### Success Responses
- 200: Successful operation
- 201: Resource created
- 204: No content (successful deletion)

[Screenshot: Success Response]
*Add screenshot showing a successful response*

### Error Responses
- 400: Bad Request
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

[Screenshot: Error Response]
*Add screenshot showing an error response*

## Tips for Testing

1. Schema Validation
   - Expand schema sections
   - Review required fields
   - Check data types

[Screenshot: Schema Validation]
*Add screenshot showing schema details*

2. Try It Out Feature
   - Use "Try it out" button
   - Fill in parameters
   - Execute request
   - Review response

[Screenshot: Try It Out Feature]
*Add screenshot showing the "Try it out" feature*

3. Response Examination
   - Check status codes
   - Verify response bodies
   - Validate error messages

[Screenshot: Response Examination]
*Add screenshot showing response details*

## Common Issues and Solutions

1. Authorization
   - No authorization required for current version
   - Future versions will implement security

2. CORS
   - CORS is enabled for localhost
   - Test cross-origin requests if needed

3. Data Persistence
   - Database is SQLite
   - Data persists between restarts
   - Clear database if needed

## Future Enhancements

1. Authentication
   - JWT implementation
   - Role-based access control
   - API key support

2. Additional Documentation
   - More detailed schemas
   - Example values
   - Response examples

[Screenshot: Future Features]
*Add screenshot showing planned enhancements*

## Troubleshooting

1. Swagger UI Not Loading
   - Verify application is running
   - Check browser console
   - Clear browser cache

2. Request Failures
   - Verify JSON format
   - Check required fields
   - Validate data types

3. Response Issues
   - Check network tab
   - Verify content types
   - Review error messages

[Screenshot: Troubleshooting]
*Add screenshot showing debugging tools* 