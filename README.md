# Leave Management System – Backend

This is the **backend API** for the Leave Management System, built with NestJS.

It handles authentication, business logic, data persistence, reporting, and background jobs.

---

## Overview

The backend is responsible for:

- Authentication and authorization
- Business rules and validations
- Employee and leave management
- Reporting
- Background tasks via cron jobs

---

## Tech Stack

- NestJS
- TypeScript
- Relational Database (SQLite)
- ORM: Prisma
- JWT Authentication
- @nestjs/schedule (Cron jobs)

---

## Core Domains

- Employee
- Department
- Role
- Designation
- Leave Type
- Leave Request

All business rules are enforced at the service layer.

---

## Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Guards are used to protect routes
- Permissions are enforced server-side

---

## Cron Jobs

The application uses **NestJS ScheduleModule**.

Typical cron jobs include:

- Leave balance check

### Verifying Cron Jobs

Cron jobs are registered at application startup.

To confirm:

- Check application logs
- Use `SchedulerRegistry` in `onModuleInit` to list registered jobs

Cron jobs run **only while the backend is running**.

---

## Environment Setup

Create a `.env` file in the backend root:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
JWT_EXPIRATION=expiration
```

## Running the project

- View the db at:

> ./prisma/dev.db

- Development mode:

```bash
npm install
npx prisma migrate reset
npm run start:dev
```

- The app will be available at

```bash
http://localhost:3000/api/v1
```

## Note

> You will have to login as super admin and configure the system by creating departments, roles, designations, employees, leave types.
