# Task Manager Application

A full-stack task management application built with Angular frontend and ASP.NET Core Web API backend.

## Project Structure

```
Angular/
├── https://github.com/sohil-khann/ASP.Net-Core-WebApi-BackEnd-Development/tree/task-manager/TASKManager         # ASP.NET Core Web API (Backend)
│   
│
└── taskUI/               # Angular Frontend
    ├── src/              # Source code
    ├── public/           # Static assets
    └── node_modules/    # Dependencies
```

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT Bearer Token
- **Caching**: Redis Distributed Cache (optional)
- **Logging**: Serilog
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 19
- **Build Tool**: Vite / Angular CLI
- **Package Manager**: npm

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Mark tasks as complete
- Role-based access (User, Admin)
- Redis caching for improved performance (optional)
- RESTful API with Swagger documentation
- Cross-origin resource sharing (CORS) enabled

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Tasks (Protected - Requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for current user |
| GET | `/api/tasks/{id}` | Get specific task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update task |
| PATCH | `/api/tasks/{id}/complete` | Mark task complete |
| DELETE | `/api/tasks/{id}` | Delete task |

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- SQL Server (local or Docker)
- Redis (optional - falls back to database)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd TASKManager
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update `appsettings.json` with your connection strings:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TaskManager;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Redis": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "TaskManager"
  },
  "Jwt": {
    "Key": "YourSecretKeyHere",
    "Issuer": "TaskManagerApi",
    "Audience": "TaskManagerApiUsers"
  }
}
```

4. Run migrations:
```bash
dotnet ef database update
```

5. Start the API:
```bash
dotnet run
```

The API will be available at `https://localhost:5001` with Swagger at `/swagger`

### Frontend Setup

```bash
cd taskUI
npm install
npm start
```

## Project Dependencies

### Backend NuGet Packages
- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Design
- Microsoft.Extensions.Caching.StackExchangeRedis
- Serilog
- Serilog.AspNetCore
- Serilog.Sinks.File
- Swashbuckle.AspNetCore

## License

MIT
