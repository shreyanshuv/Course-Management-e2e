# API Testing Report
Generated on: 2025-06-24 05:04:32

## Test Environment
- Host: http://localhost:8080
- Timestamp: 2025-06-24_05-04-32

## Test Results Summary

### Test Case: Create Basic Course
- Description: Create a new course without prerequisites
- Method: POST
- Endpoint: /api/courses
- Status: ✅ PASSED (Expected: 201, Got: 201)
```json
{"id":1,"courseId":"CS101","title":"Introduction to Programming","description":"Basic programming concepts","prerequisites":[]}```

### Test Case: Create Course Invalid Data
- Description: Attempt to create a course with invalid data
- Method: POST
- Endpoint: /api/courses
- Status: ✅ PASSED (Expected: 400, Got: 400)
```json
Course ID and title are required```

### Test Case: Create Prerequisite Course
- Description: Create a prerequisite course
- Method: POST
- Endpoint: /api/courses
- Status: ✅ PASSED (Expected: 201, Got: 201)
```json
{"id":2,"courseId":"MATH101","title":"Basic Mathematics","description":"Fundamental mathematics concepts","prerequisites":[]}```

### Test Case: Create Course with Prerequisites
- Description: Create a course with prerequisites
- Method: POST
- Endpoint: /api/courses
- Status: ✅ PASSED (Expected: 201, Got: 201)
```json
{"id":3,"courseId":"CS201","title":"Data Structures","description":"Advanced programming concepts","prerequisites":[{"id":1,"courseId":"CS101","title":"Introduction to Programming","description":"Basic programming concepts","prerequisites":[]}]}```

### Test Case: Create Course Invalid Prerequisites
- Description: Attempt to create a course with invalid prerequisites
- Method: POST
- Endpoint: /api/courses
- Status: ✅ PASSED (Expected: 400, Got: 400)
```json
One or more prerequisites do not exist```

### Test Case: Get All Courses
- Description: Retrieve all courses
- Method: GET
- Endpoint: /api/courses
- Status: ✅ PASSED (Expected: 200, Got: 200)
```json
[{"id":1,"courseId":"CS101","title":"Introduction to Programming","description":"Basic programming concepts","prerequisites":[]},{"id":2,"courseId":"MATH101","title":"Basic Mathematics","description":"Fundamental mathematics concepts","prerequisites":[]},{"id":3,"courseId":"CS201","title":"Data Structures","description":"Advanced programming concepts","prerequisites":[{"id":1,"courseId":"CS101","title":"Introduction to Programming","description":"Basic programming concepts","prerequisites":[]}]}]```

### Test Case: Get Course by ID
- Description: Retrieve a specific course
- Method: GET
- Endpoint: /api/courses/1
- Status: ✅ PASSED (Expected: 200, Got: 200)
```json
{"id":1,"courseId":"CS101","title":"Introduction to Programming","description":"Basic programming concepts","prerequisites":[]}```

### Test Case: Get Non-existent Course
- Description: Attempt to retrieve a non-existent course
- Method: GET
- Endpoint: /api/courses/999
- Status: ✅ PASSED (Expected: 404, Got: 404)
```json
```

### Test Case: Create Course Instance
- Description: Create a new course instance
- Method: POST
- Endpoint: /api/instances
- Status: ✅ PASSED (Expected: 201, Got: 201)
```json
{"id":1,"course":{"id":1,"courseId":"CS101","title":"Introduction to Programming","description":"Basic programming concepts"},"courseId":"CS101","year":2025,"semester":1,"instructor":"Dr. Smith","courseTitle":"Introduction to Programming","courseDescription":"Basic programming concepts"}```

### Test Case: Get Course Instances
- Description: Retrieve course instances for a specific year and semester
- Method: GET
- Endpoint: /api/instances/2025/1
- Status: ✅ PASSED (Expected: 200, Got: 200)
```json
[{"id":1,"course":{"id":1,"courseId":"CS101","title":"Introduction to Programming","description":"Basic programming concepts"},"courseId":"CS101","year":2025,"semester":1,"instructor":"Dr. Smith","courseTitle":"Introduction to Programming","courseDescription":"Basic programming concepts"}]```

### Test Case: Delete Course Instance
- Description: Delete a course instance
- Method: DELETE
- Endpoint: /api/instances/2025/1/CS101
- Status: ✅ PASSED (Expected: 200, Got: 200)
```json
```

### Test Case: Delete Course with Dependencies
- Description: Attempt to delete a course that is a prerequisite
- Method: DELETE
- Endpoint: /api/courses/1
- Status: ✅ PASSED (Expected: 409, Got: 409)
```json
Cannot delete course as it is a prerequisite for other courses: CS201```

## Test Summary
- Total Tests: 12
- Passed: 12
- Failed: 0
- Success Rate: 100%

## Test Environment Details
- Operating System: Darwin
- Date: Tue Jun 24 05:04:45 IST 2025
- API Version: v1.0
