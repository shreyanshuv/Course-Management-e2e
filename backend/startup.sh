#!/bin/bash

# Start time synchronization
echo "Starting time synchronization..."
ntpd -d &

# Start the Spring Boot application in background
echo "Starting Spring Boot application..."
java $JAVA_OPTS -jar app.jar &

# Wait for application to be ready
echo "Waiting for application to start..."
sleep 30

# Run the tests
echo "Running tests..."
./run-tests.sh

# Wait for all background processes
wait 