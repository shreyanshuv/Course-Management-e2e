#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test report file
REPORT_FILE="test_report.md"
RESPONSE_DIR="test_responses"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')

# Create directories for test artifacts
mkdir -p "$RESPONSE_DIR"

# Initialize report file
cat > "$REPORT_FILE" << EOF
# API Testing Report
Generated on: $(date '+%Y-%m-%d %H:%M:%S')

## Test Environment
- Host: http://localhost:8080
- Timestamp: $TIMESTAMP

## Test Results Summary
EOF

# Counter for tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to make API calls and check responses
test_api() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local payload="$4"
    local expected_status="$5"
    local description="$6"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n${YELLOW}Running Test: $test_name${NC}"
    echo "Endpoint: $method $endpoint"
    
    # Create test case in report
    echo -e "\n### Test Case: $test_name" >> "$REPORT_FILE"
    echo "- Description: $description" >> "$REPORT_FILE"
    echo "- Method: $method" >> "$REPORT_FILE"
    echo "- Endpoint: $endpoint" >> "$REPORT_FILE"
    
    # Make API call
    local response_file="$RESPONSE_DIR/${test_name// /_}_response.json"
    local http_status
    
    if [ "$method" = "GET" ]; then
        http_status=$(curl -s -w "%{http_code}" -X GET "http://localhost:8080$endpoint" -o "$response_file")
    else
        http_status=$(curl -s -w "%{http_code}" -X "$method" "http://localhost:8080$endpoint" \
            -H "Content-Type: application/json" \
            -d "$payload" \
            -o "$response_file")
    fi
    
    # Check response
    if [ "$http_status" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ Test passed (Status: $http_status)${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "- Status: ✅ PASSED (Expected: $expected_status, Got: $http_status)" >> "$REPORT_FILE"
    else
        echo -e "${RED}✗ Test failed (Expected: $expected_status, Got: $http_status)${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "- Status: ❌ FAILED (Expected: $expected_status, Got: $http_status)" >> "$REPORT_FILE"
    fi
    
    # Add response to report
    echo "\`\`\`json" >> "$REPORT_FILE"
    cat "$response_file" >> "$REPORT_FILE"
    echo "\`\`\`" >> "$REPORT_FILE"
    
    # Sleep briefly between requests
    sleep 1
}

# Wait for the application to start
echo "Waiting for the application to start..."
until curl -s http://localhost:8080/actuator/health &> /dev/null; do
    echo "Waiting for application to become available..."
    sleep 5
done

echo -e "${GREEN}Application is running. Starting tests...${NC}"

# Test Scenario 1: Create Basic Course
test_api "Create Basic Course" "POST" "/api/courses" '{
    "courseId": "CS101",
    "title": "Introduction to Programming",
    "description": "Basic programming concepts",
    "prerequisites": []
}' 201 "Create a new course without prerequisites"

# Test Scenario 2: Create Course with Invalid Data
test_api "Create Course Invalid Data" "POST" "/api/courses" '{
    "courseId": "",
    "title": "",
    "description": ""
}' 400 "Attempt to create a course with invalid data"

# Test Scenario 3: Create Prerequisite Course
test_api "Create Prerequisite Course" "POST" "/api/courses" '{
    "courseId": "MATH101",
    "title": "Basic Mathematics",
    "description": "Fundamental mathematics concepts",
    "prerequisites": []
}' 201 "Create a prerequisite course"

# Test Scenario 4: Create Course with Prerequisites
test_api "Create Course with Prerequisites" "POST" "/api/courses" '{
    "courseId": "CS201",
    "title": "Data Structures",
    "description": "Advanced programming concepts",
    "prerequisites": [{"courseId": "CS101"}]
}' 201 "Create a course with prerequisites"

# Test Scenario 5: Create Course with Invalid Prerequisites
test_api "Create Course Invalid Prerequisites" "POST" "/api/courses" '{
    "courseId": "CS301",
    "title": "Advanced Programming",
    "description": "Expert level programming",
    "prerequisites": [{"courseId": "INVALID101"}]
}' 400 "Attempt to create a course with invalid prerequisites"

# Test Scenario 6: Get All Courses
test_api "Get All Courses" "GET" "/api/courses" "" 200 "Retrieve all courses"

# Test Scenario 7: Get Course by ID
test_api "Get Course by ID" "GET" "/api/courses/1" "" 200 "Retrieve a specific course"

# Test Scenario 8: Get Non-existent Course
test_api "Get Non-existent Course" "GET" "/api/courses/999" "" 404 "Attempt to retrieve a non-existent course"

# Test Scenario 9: Create Course Instance
test_api "Create Course Instance" "POST" "/api/instances" '{
    "courseId": "CS101",
    "year": 2025,
    "semester": 1,
    "instructor": "Dr. Smith"
}' 201 "Create a new course instance"

# Test Scenario 10: Get Course Instances by Year/Semester
test_api "Get Course Instances" "GET" "/api/instances/2025/1" "" 200 "Retrieve course instances for a specific year and semester"

# Test Scenario 11: Delete Course Instance
test_api "Delete Course Instance" "DELETE" "/api/instances/2025/1/CS101" "" 200 "Delete a course instance"

# Test Scenario 12: Delete Course with Dependencies
test_api "Delete Course with Dependencies" "DELETE" "/api/courses/1" "" 409 "Attempt to delete a course that is a prerequisite"

# Update report with summary
cat >> "$REPORT_FILE" << EOF

## Test Summary
- Total Tests: $TOTAL_TESTS
- Passed: $PASSED_TESTS
- Failed: $FAILED_TESTS
- Success Rate: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%

## Test Environment Details
- Operating System: $(uname -s)
- Date: $(date)
- API Version: v1.0
EOF

echo -e "\n${YELLOW}Test Summary:${NC}"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo -e "Success Rate: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%"
echo -e "\nDetailed report has been generated in $REPORT_FILE" 