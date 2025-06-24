# Docker Quick Start Guide

This guide provides step-by-step instructions for running the Course Management System using Docker and Docker Compose.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your machine.

## 1. Set the Docker Username

This project requires a Docker Hub username for building and tagging the images. For this project, we will use `shreyanshuv`.

Open your terminal and run the following command to set the environment variable:

```bash
export DOCKER_USERNAME=shreyanshuv
```

**Note:** You must run this command in every new terminal session before using `docker-compose`. To make it permanent, add it to your shell's startup file (e.g., `~/.zshrc`, `~/.bashrc`).

## 2. Build and Run the Application

With the `DOCKER_USERNAME` set, you can now build the Docker images and start the containers.

Navigate to the `Course-Management-e2e` directory in your terminal and run:

```bash
docker-compose up --build -d
```

- `--build`: This flag tells Docker Compose to build the images from the Dockerfiles before starting the containers.
- `-d`: This flag runs the containers in "detached" mode, meaning they will run in the background.

## 3. Accessing the Application

Once the containers are up and running, you can access the different parts of the system:

- **Frontend (UI):** [http://localhost](http://localhost)
- **Backend API:** [http://localhost:8080](http://localhost:8080)
- **API Documentation (Swagger):** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Common Docker Commands

Here are some useful commands for managing your Docker environment.

### Check Container Status

To see which containers are currently running:

```bash
docker-compose ps
```

You should see both `course-management-backend` and `course-management-frontend` with a `STATUS` of `Up`.

### View Logs

To view the real-time logs from all running containers:

```bash
docker-compose logs -f
```

To view logs for a specific service (e.g., `frontend`):

```bash
docker-compose logs -f frontend
```

### Stop the Application

To stop and remove the running containers, network, and volumes:

```bash
docker-compose down
```

### Restart the Application

If the containers are already built, you can restart them without rebuilding:

```bash
docker-compose up -d
```

To force a rebuild and restart (e.g., after code changes):

```bash
docker-compose up --build -d --force-recreate
```

## Troubleshooting

- **`invalid tag` or `DOCKER_USERNAME not set` error:** This means you forgot to run `export DOCKER_USERNAME=rosenta`. Run that command and try again.
- **`address already in use` error for port 8080:** Another application is using port 8080. Stop the other application or change the port mapping in the `docker-compose.yaml` file.
- **Permission errors in the `frontend` container:** This guide assumes the frontend container is run as `root`. If you encounter permission issues, ensure the `frontend/Dockerfile` does not contain any `USER` directives.

Enjoy using the Course Management System!
