# Sah Family Office Application

A fresh Spring Boot and MongoDB application for managing company departments and staff records. It includes a browser dashboard, REST API, validation, error handling, a test, and the Maven Wrapper.

## Project structure

```text
sahFamilyApplication/
├── .mvn/wrapper/maven-wrapper.properties
├── src/
│   ├── main/java/com/sahfamily/office/
│   │   ├── SahFamilyApplication.java
│   │   ├── controller/       # REST endpoints
│   │   ├── entity/           # Department and Staff documents
│   │   ├── exception/        # API error handling
│   │   ├── repository/       # MongoDB repositories
│   │   └── service/          # Application rules
│   ├── main/resources/
│   │   ├── application.properties
│   │   └── static/index.html # Browser dashboard
│   └── test/java/            # Automated health endpoint test
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

## Requirements

- Java 17 or later
- IntelliJ IDEA or another Java IDE
- MongoDB running locally, or a MongoDB Atlas connection URI

## Run on macOS

1. Extract the ZIP file.
2. Start MongoDB locally, or prepare your MongoDB Atlas connection string.
3. Open the extracted `sahFamilyApplication` folder in IntelliJ IDEA and allow Maven to import the project.
4. Set the project SDK to Java 17 or later.
5. In Terminal, move into the extracted project folder.
6. Run `./mvnw spring-boot:run` to start the application. The first run needs an internet connection to download Maven and dependencies.
7. Open `http://localhost:8080` in your browser for the dashboard.

Default MongoDB connection: `mongodb://localhost:27017/sah_family_db`

To use MongoDB Atlas, set `MONGODB_URI` to your connection string before starting the application. Keep private credentials out of GitHub.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check application status |
| POST | `/api/departments` | Create a department |
| GET | `/api/departments` | List departments |
| GET | `/api/departments/{id}` | Get a department |
| PUT | `/api/departments/{id}` | Update a department |
| DELETE | `/api/departments/{id}` | Delete a department if it has no staff |
| POST | `/api/staff` | Create a staff record |
| GET | `/api/staff` | List staff records |
| GET | `/api/staff?departmentId={id}` | Filter staff by department |
| GET | `/api/staff/{id}` | Get a staff record |
| PUT | `/api/staff/{id}` | Update a staff record |
| DELETE | `/api/staff/{id}` | Delete a staff record |

## Postman examples

### Create a department
`POST http://localhost:8080/api/departments`

Select **Body → raw → JSON**:

```json
{
  "name": "Information Technology",
  "description": "Manages company systems, networks, and technical support.",
  "location": "Kathmandu"
}
```

Copy the `id` from the response before creating a staff member.

### Create a staff member
`POST http://localhost:8080/api/staff`

```json
{
  "fullName": "Aarav Sah",
  "email": "aarav.sah@example.com",
  "phone": "+977-9800000000",
  "jobTitle": "IT Support Officer",
  "salary": 45000,
  "departmentId": "REPLACE_WITH_REAL_DEPARTMENT_ID"
}
```

Replace the department ID with the real ID returned by MongoDB. Example staff data is fictional.

## Run tests

```bash
./mvnw test
```

## GitHub

After testing, create a new empty repository named `sah-family-office-api` on GitHub. Then run these commands from this project directory, replacing the username with your own:

```bash
git init
git add .
git commit -m "Build Sah Family office records application"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/sah-family-office-api.git
git push -u origin main
```

Do not commit database passwords, private connection strings, or real staff information.

## React frontend

The React + Vite UI is located in the separate `frontend/` folder. See `frontend/README.md` for setup and run instructions. Start the Spring Boot API on port 8080, then run `npm install` and `npm run dev` inside `frontend/`. The Vite development server proxies `/api` calls to the existing backend, so the backend endpoints and MongoDB data remain unchanged.
