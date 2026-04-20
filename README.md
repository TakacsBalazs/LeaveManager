# Employee Leave Manager System

A full-stack web application designed for HR management to handle employee leave balances and leave requests. Built with .NET 8 and Angular 19, focusing on a clean UI and secure data handling.

## Key Features
* Leave Tracking: Automatically calculate the balance (Total, Used, Remaining days).
* Admin Dashboard: Manage employees and approve/reject leave requests.
* Role-Based Security: Secure login for both Admins and Employees using ASP.NET Core Identity.
* Data: Server-side validation to prevent invalid data.

## Tech Stack
* Backend: ASP.NET Core Web API (.NET 8.0), Entity Framework Core
* Database: SQL Server
* Security: JWT Authentication & Identity Framework
* Frontend: Angular 19.2.0, RxJS, Tailwind CSS

## Getting Started

### Prerequisites
* .NET 8 SDK
* Node.js
* SQL Server

### Installation

1. Clone the repository:
   git clone https://github.com/TakacsBalazs/LeaveManager.git

2. Backend Setup:
   * Update ConnectionStrings in appsettings.json.
   * **CORS:** Check the `AllowedOrigins` in `appsettings.json` matches your frontend URL (default: http://localhost:4200).
   * Navigate to the backend folder: 
    ```bash 
        cd backend/LeaveManagerAPI
    ```
   * Run in Terminal:
    ```bash
        dotnet ef database update
    ```
    ```bash
        dotnet run
    ```

3. Frontend Setup:
   * Navigate to the frontend folder: 
    ```bash
        cd frontend
    ```
   * Install & Launch:
    ```bash
     npm install
    ```
    ```bash
     ng serve
    ```