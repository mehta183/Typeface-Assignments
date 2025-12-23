# File Share Backend

Minimal README for the backend service.

Prerequisites
- Java 17+ (Temurin or OpenJDK)
- Maven 3.8+
- PostgreSQL (or run via Docker Compose)

Build & Run (local)
1. Configure database in `src/main/resources/application.yml` or set env vars:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
2. Build:
```bash
mvn clean package -DskipTests
```
3. Run:
```bash
java -jar target/*.jar
```

Using Docker
1. Build image from project root:
```bash
docker build -t fileshare-backend ./backend
```
2. Or use provided `docker-compose.yml` (recommended for dev):
```bash
docker compose up --build
```

Storage
- Uploaded files are stored under the `app.storage.location` configured in `application.yml` (default `./uploads`). When running in Docker the `backend_uploads` volume maps `/app/uploads`.

Notes
- JWT secret and expiration are configured in `application.yml` under `app.jwt`.
- Lombok is used in the sources; enable annotation processing in your IDE.
