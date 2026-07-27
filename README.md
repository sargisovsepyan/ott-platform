# Lumio OTT Platform

Lumio is a full-stack OTT streaming platform created as a portfolio project.

The application includes a public movie catalogue, user authentication, individual movie pages, an administration panel, movie management, homepage configuration, and user management.

## Live Website

Frontend:

```text
https://ott-platform-liard.vercel.app
```

Backend API:

```text
https://lumio-api-kpsv.onrender.com
```

> The backend uses the free Render plan, so the first request after a period of inactivity may take several seconds.

## Main Features

- User registration and login
- JWT authentication
- User and administrator roles
- Public movie catalogue
- Search, filtering, sorting, and pagination
- Individual movie pages
- Responsive design for desktop and mobile
- Admin movie management
- Movie poster uploads with Cloudinary
- Movie video uploads
- Default Coming Soon video
- Homepage movie configuration
- Admin user management
- API rate limiting
- Centralized error handling
- Swagger API documentation

## Technologies

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Joi
- Cloudinary
- Multer
- Swagger
- Morgan
- Express Rate Limit
- CORS

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Fetch API
- Lucide React

## Project Structure

```text
ott-platform/
├── assets/
│   ├── posters/
│   └── videos/
├── docs/
├── ott-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
├── ott-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   └── vercel.json
├── references/
└── README.md
```

## Local Installation

Clone the repository:

```bash
git clone <repository-url>
cd ott-platform
```

Install backend dependencies:

```bash
cd ott-backend
npm install
```

Install frontend dependencies:

```bash
cd ../ott-frontend
npm install
```

## Environment Variables

Create an `.env` file inside `ott-backend` using `.env.example` as a template.

Required backend variables:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

DEFAULT_COMING_SOON_VIDEO_URL=
CLIENT_ORIGINS=http://localhost:5173
```

Frontend environment variable:

```env
VITE_API_BASE_URL=/api
```

Never commit real passwords, API keys, or `.env` files.

## Running Locally

Start the backend:

```bash
cd ott-backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd ott-frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/api-docs
```

## Main API Endpoints

### Authentication

| Method |        Endpoint     | Access |       Description        |
|--------|---------------------|--------|--------------------------|
|  POST  | `/api/auth/register`| Public | Register a new user      |
|  POST  | `/api/auth/login`   | Public | Log in and receive a JWT |

### Movies

| Method |        Endpoint         | Access|                     Description                          |
|--------|-------------------------|-------|----------------------------------------------------------|
|   GET  | `/api/movies`           | Public| Get movies with search, filters, sorting, and pagination |
|   GET  | `/api/movies/:id`       | Public| Get one movie by ID                                      |
|   POST | `/api/movies`           | Admin | Create a movie                                           |
|  PATCH | `/api/movies/:id`       | Admin | Update movie information                                 |
|  PATCH | `/api/movies/:id/poster`| Admin | Replace a movie poster                                   |
|  PATCH | `/api/movies/:id/video` | Admin | Upload or replace a movie video                          |
| DELETE | `/api/movies/:id/video` | Admin | Delete a custom movie video                              |
| DELETE | `/api/movies/:id`       | Admin | Delete a movie                                           |

### Homepage

| Method |     Endpoint           | Access |              Description                      |
|--------|------------------------|--------|-----------------------------------------------|
|   GET  | `/api/homepage`        | Public | Get movies configured for the homepage        |
|   GET  | `/api/homepage/config` | Admin  | Get the complete homepage configuration       |
|   PUT  | `/api/homepage/config` | Admin  | Update homepage movie order and display count |

### Admin Users

| Method |        Endpoint        | Access |                Description                       |
|--------|------------------------|--------|--------------------------------------------------|
|   GET  | `/api/admin/users`     |  Admin | Get users with search, filtering, and pagination |
| DELETE | `/api/admin/users/:id` |  Admin | Delete a user                                    |

## Authentication

Protected routes require a JWT in the `Authorization` header:

```text
Authorization: Bearer <your-token>
```

Administrator-only endpoints also verify that the authenticated user has the `admin` role.

## Media Uploads

Movie posters and videos are uploaded using `multipart/form-data`.

Expected file fields:

```text
poster
video
```

Uploaded media is stored in Cloudinary, while the corresponding URLs and metadata are saved in MongoDB.

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Media storage: Cloudinary

## Future Improvements

- Email verification
- Forgot password and password reset
- Change password
- Favorites and watchlist
- Continue watching
- Reviews and ratings
- Automated tests
- Custom domain

## Author

**Sargis Hovsepyan**

Full-stack portfolio project created to demonstrate practical knowledge of React, Node.js, Express, MongoDB, authentication, authorization, REST APIs, media uploads, Git, and production deployment.