# Stock Management App

[![CI](https://github.com/PhillipMarais/Stock-Management-App/actions/workflows/ci.yml/badge.svg)](https://github.com/PhillipMarais/Stock-Management-App/actions/workflows/ci.yml)

A full-stack vehicle stock management app. Users sign in, browse the vehicle inventory, and add, edit or remove vehicles together with their images and accessories.

The front end is built with **Angular** and the back end is an **ASP.NET Core Web API** with **Entity Framework Core** and **SQL Server**. Sign-in uses **Firebase Authentication**.

## Features

- **Accounts:** register, log in, email verification and password reset through Firebase Authentication.
- **Stock table:** search across stock details, sort by manufacturer, model, cost price or retail price, and page through results.
- **Vehicle records:** create, view, edit and delete vehicles with model year, description, manufacturer, colour, registration number, VIN, kilometre reading, cost price and retail price.
- **Accessories:** add and remove named accessories with descriptions on each vehicle.
- **Images:** upload several images per vehicle. The API stores them in SQL Server.
- **Feedback:** toast notifications after saving or deleting stock.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Front end | Angular 16, TypeScript, Angular Material, PrimeNG, Bootstrap, ngx-pagination, ngx-toastr |
| Back end | ASP.NET Core Web API (.NET 10), Entity Framework Core 10 (code-first migrations), Swagger |
| Database | SQL Server |
| Auth and hosting | Firebase Authentication, Firebase Hosting config |

## API endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/Vehicle` | List all vehicles |
| POST | `/api/Vehicle` | Add a vehicle |
| PUT | `/api/Vehicle` | Update a vehicle |
| DELETE | `/api/Vehicle/{id}` | Delete a vehicle |
| GET | `/api/StockImages` | List stock images |
| POST | `/api/StockImages/{id}` | Upload images for a vehicle |
| PUT | `/api/StockImages/{id}` | Replace a vehicle's images |
| DELETE | `/api/StockImages/{id}` | Delete a vehicle's images |

With the API running, Swagger UI lists these at `https://localhost:7199/swagger`.

## Project structure

```
src/app/
  component/       login, register, verify email, forgot password, dashboard, stock (add, view, edit, delete)
  model/           Vehicle and Accessory models
  shared/          DataService (API calls) and AuthService (Firebase sign-in)
StockManagementAPI/
  StockManagementAPI/
    Controllers/   VehicleController, StockImagesController
    Data/          Entity Framework DataContext
    Migrations/    EF Core migrations
dataScript/        SQL script for the database
```

## Running locally

**You will need:** Node.js 18 or newer, the .NET 10 SDK, and SQL Server Express (or update the connection string for another SQL Server instance).

1. **Database.** Either run `dataScript/data.sql` against SQL Server, or apply the migrations from the API folder:
   ```
   cd StockManagementAPI/StockManagementAPI
   dotnet ef database update
   ```
   The default connection string in `appsettings.json` points to `localhost\sqlexpress` and a database named `stockmanagementdb`.
2. **API.** Open `StockManagementAPI/StockManagementAPI.sln` in Visual Studio 2022 and run it, or run `dotnet run` from `StockManagementAPI/StockManagementAPI`. It listens on `https://localhost:7199`.
3. **Front end.** From the repository root:
   ```
   npm install
   ng serve
   ```
   Then open `http://localhost:4200`. The front end calls the API at the `apiUrl` set in `src/environments/environment.ts`.
4. **Firebase.** Sign-in uses the Firebase project configured in `src/environments/environment.ts`. To use your own, create a Firebase project with Email/Password sign-in enabled and replace the `firebase` settings there.

## Continuous integration

GitHub Actions builds the API and the front end on every push and pull request. The API build treats warnings as errors and fails if any NuGet package (including indirect ones) has a known vulnerability.
