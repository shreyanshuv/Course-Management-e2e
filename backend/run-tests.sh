#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Make test script executable
chmod +x test-api.sh

# Check if application is already running
if curl -s http://localhost:8080/actuator/health &> /dev/null; then
    echo -e "${GREEN}Application is already running.${NC}"
else
    echo "Starting Spring Boot application..."
    # Start the application in the background
    mvn spring-boot:run &
    
    # Save the PID
    SPRING_PID=$!
    
    # Wait for application to start
    echo "Waiting for application to start..."
    until curl -s http://localhost:8080/actuator/health &> /dev/null; do
        sleep 5
    done
fi

# Run the tests
./test-api.sh

# If we started the application, shut it down
if [ ! -z "$SPRING_PID" ]; then
    echo "Shutting down Spring Boot application..."
    kill $SPRING_PID
fi

# Check if any test responses directory exists and create a timestamped archive
if [ -d "test_responses" ]; then
    TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
    ARCHIVE_NAME="test_results_${TIMESTAMP}.tar.gz"
    
    echo "Archiving test results..."
    tar -czf "$ARCHIVE_NAME" test_responses test_report.md
    
    echo -e "${GREEN}Test results archived to $ARCHIVE_NAME${NC}"
    
    # Clean up
    rm -rf test_responses
fi

echo -e "${GREEN}Testing completed!${NC}" 