# POS System - Next.js & .NET Core

A modern Point of Sale (POS) system built with Next.js frontend and .NET Core backend, featuring real-time capabilities, comprehensive inventory management, and secure authentication.

## 🚀 Features

- **Modern Frontend**
  - Next.js 15 with TypeScript
  - Material UI for beautiful, responsive interfaces
  - React Query for efficient data fetching
  - Real-time updates with SignalR
  - Form handling with React Hook Form
  - PDF generation with jsPDF

- **Robust Backend**
  - .NET Core API
  - Entity Framework Core
  - PostgreSQL Database
  - SignalR for real-time communication
  - JWT Authentication
  - Swagger API Documentation

- **Security & Authentication**
  - Keycloak Integration
  - Role-based access control
  - Secure API endpoints
  - Session management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1.6
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **State Management**: React Query
- **Forms**: React Hook Form
- **PDF Generation**: jsPDF
- **Styling**: CSS Modules
- **Testing**: Jest, Playwright

### Backend
- **Framework**: .NET Core
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Real-time**: SignalR
- **Authentication**: Keycloak
- **API Documentation**: Swagger

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Next.js pages
│   ├── api/          # API routes
│   ├── styles/       # Global styles
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript types
│
backend/
├── Controllers/      # API controllers
├── Models/          # Data models
├── Services/        # Business logic
├── Migrations/      # Database migrations
└── Hubs/           # SignalR hubs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- .NET Core SDK 7.0+
- PostgreSQL
- Docker (optional)

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Restore NuGet packages:
```bash
cd backend
dotnet restore
```

2. Configure database connection in `appsettings.json`

3. Run database migrations:
```bash
dotnet ef database update
```

4. Start the backend:
```bash
dotnet run
```

## 🐳 Docker Setup

Run the entire stack using Docker Compose:

```bash
docker-compose up -d --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5107
- Keycloak: http://localhost:8282
- PostgreSQL: localhost:5432

## 🔧 Development

### Frontend Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint

### Backend Development
- `dotnet run` - Start development server
- `dotnet test` - Run tests
- `dotnet ef migrations add <name>` - Create new migration
- `dotnet ef database update` - Apply migrations

## 📚 API Documentation

API documentation is available at `/swagger` when running the backend server.

## 🔐 Authentication

The system uses Keycloak for authentication. Configure your Keycloak instance and update the environment variables accordingly.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ by [Your Team Name]

