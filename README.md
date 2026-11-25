# Patient Admission Management

A patient-admission dashboard for viewing and managing hospital patient records. The React frontend provides the patient interface and connects to a FastAPI API configured through environment variables.

## Features

- Add and view patient admission records
- Search patients by name and filter by ward, department, and doctor
- Edit and delete patient records
- Discharge admitted patients

These workflows use the API contract below. The current checkout does not include the backend application source or route definitions, so the API server is not runnable from this checkout alone.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy
- **Database:** PostgreSQL (including Neon through a PostgreSQL connection URL)

## Project structure

```text
.
├── backend/
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── patients/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── types/
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Local setup

### Frontend

Requires Node.js and npm.

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The Vite development server prints its local URL when it starts.

### Backend

Requires Python. The backend directory currently contains dependency and environment-example files, but no FastAPI application module or routes.

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
# .\.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

The dependencies and configuration can be prepared with these steps, but there is no ASGI application in this checkout to start. Add or restore the backend implementation before running the API.

## Environment variables

Copy each `.env.example` to `.env` and replace placeholders locally. Never commit `.env` files or put real credentials in this README.

**`backend/.env`**

```dotenv
APP_NAME=Patient Admission Management API
APP_VERSION=1.0.0
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql+psycopg://<user>:<password>@<host>:5432/<database>?sslmode=require
```

Use the connection URL supplied by your PostgreSQL provider, such as Neon.

**`frontend/.env`**

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

## API endpoints

These are the methods and paths the frontend currently calls. They describe the frontend's expected API contract; server-side implementation is not present in this checkout.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/patients/` | List patients |
| `POST` | `/patients/` | Add a patient |
| `PUT` | `/patients/{patient_id}` | Update a patient |
| `DELETE` | `/patients/{patient_id}` | Delete a patient |
| `PATCH` | `/patients/{patient_id}/discharge` | Discharge a patient |

## Screenshots

- Patient dashboard: _Screenshot placeholder_
- Add/edit patient form: _Screenshot placeholder_

## Links

- **Live demo:** _URL to be added_
- **GitHub:** _Repository URL to be added_
