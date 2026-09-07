# secure-coding-webapp

Front-end for a secure-coding course project: a small customer-management app built around a hardened authentication flow.

## What it does

- **Authentication** – register, login, change password, forgot / reset password flows
- **Password policy** – configurable rules (length, complexity, history, dictionary words) enforced client-side before submission (`src/utils/passwordPolicy.jsx`)
- **Protected routes** – pages behind login via a `ProtectedRoute` wrapper
- **Customers** – table view plus a create/edit modal with date validation
- Light / dark theme via React context

## Stack

React 19 · Vite · React Router 7 · MUI 7 · dayjs

## Run locally

```bash
npm install
npm run dev
```

Lint with `npm run lint`, production build with `npm run build`.
