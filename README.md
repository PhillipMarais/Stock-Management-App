# Stock Management App

[![CI](https://github.com/PhillipMarais/Stock-Management-App/actions/workflows/ci.yml/badge.svg)](https://github.com/PhillipMarais/Stock-Management-App/actions/workflows/ci.yml)

A full-stack vehicle stock management app. Users sign in, browse the vehicle inventory, and add, edit or remove vehicles together with their images and accessories.

The front end is built with **Angular 22** and **Angular Material**, and the back end is an **ASP.NET Core Web API** with **Entity Framework Core** and **SQL Server**. Sign-in uses **Firebase Authentication**.

## Features

- **Accounts:** register, log in, Google sign-in, email verification (with a resend option) and password reset through Firebase Authentication. The stock pages are only reachable once signed in and verified.
- **Stock table:** search by make, model, year, kilometres, registration or VIN, sort any column, and page through results.
- **Vehicle records:** add, view, edit and delete vehicles with model year, model, manufacturer, colour, registration number, VIN, kilometre reading, cost price and retail price. Forms validate every field before saving.
- **Accessories:** add and remove named accessories with descriptions on each vehicle.
- **Photos:** up to three photos per vehicle, previewed before saving. The API stores them in SQL Server.
- **Feedback:** a confirmation before deleting, and a short notice after each save or delete.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Front end | Angular 22 (standalone components, signals), TypeScript, Angular Material, Firebase JS SDK, Vitest |
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
  core/            models, StockService (API calls), AuthService and route guards (Firebase sign-in),
                   stock-logic.ts (accessory format, search, image joining) with unit tests
  features/auth/   log in, register, forgot password, verify email
  features/stock/  stock table, add/edit form, details and delete dialogs
StockManagementAPI/
  StockManagementAPI/
    Controllers/   VehicleController, StockImagesController
    Data/          Entity Framework DataContext
    Migrations/    EF Core migrations
dataScript/        SQL script for the database
```

## Running locally

**You will need:** Node.js 22 or newer, the .NET 10 SDK, and SQL Server Express (or update the connection string for another SQL Server instance).

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
   npx ng serve
   ```
   Then open `http://localhost:4200`. The front end calls the API at the `apiUrl` set in `src/environments/environment.ts`.
4. **Firebase.** Sign-in uses the Firebase project configured in `src/environments/environment.ts`. To use your own, create a Firebase project with Email/Password sign-in enabled and replace the `firebase` settings there.

## Tests

```
npx ng test
```

runs the front-end unit tests with Vitest.

## What changed in the 2026 update

The front end was rewritten from Angular 16 (NgModules, PrimeNG, Bootstrap, ngx-pagination, ngx-toastr) to Angular 22 with standalone components, signals and Angular Material only. The rewrite also fixed these bugs from the original:

- Verification emails were never sent after registering.
- The dashboard could be opened without signing in.
- Adding a vehicle without photos left the form open and didn't refresh the list.
- Editing a vehicle reset its "added" date, and the details view showed the updated date as the added date.
- Replacing photos on a vehicle that had none didn't save them (fixed in the API).

## Continuous integration

GitHub Actions builds the API and builds and tests the front end on every push and pull request. The API build treats warnings as errors and fails if any NuGet package (including indirect ones) has a known vulnerability.
