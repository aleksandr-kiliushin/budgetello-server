# Personal App &middot; <img src="https://github.com/aleksandr-kiliushin/personal-app-server/workflows/TypeScript checks, build and tests/badge.svg?branch=master" />

Personal App is an open-source budget tracking application that allows users to manage their incomes and expenses, track their budget, and analyze their financial statistics. The application provides features such as custom expense and income categories, different currencies, and shared budget boards for collaborative budget tracking.

## Backend

The backend of the Personal App handles the data management and business logic of the application. It is built using Node.js and the NestJS framework, with the Apollo GraphQL server for efficient and flexible API development. The backend uses a PostgreSQL database to store and manage user data.

## Running the backend locally

1. `git clone https://github.com/aleksandr-kiliushin/personal-app-server.git`
1. `cd personal-app-server`
1. `npm install`
1. `co ./dev.env.example ./dev.env`
1. `npm run dev:db-and-api`
1. `npm run test`

## Frontend

The frontend code for the Personal App is maintained in a separate repository. You can find the frontend code and more information about it in the [Personal App Frontend repository](https://github.com/aleksandr-kiliushin/personal-app-frontend).

The frontend provides a user-friendly interface for users to interact with their budgets, create budget boards, and visualize financial statistics. If you want to explore the frontend application locally, you can refer to the [repository](https://github.com/aleksandr-kiliushin/personal-app-frontend) for instructions on how to run it on your machine.
