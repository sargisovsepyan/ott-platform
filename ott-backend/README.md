# OTT Backend API

RESTful backend for an OTT streaming platform built with Node.js, Express, and MongoDB.


## About the Project

This project is the backend part of an OTT platform. It provides a structured REST API for user authentication, role-based authorization, movie management, image uploads, searching, filtering, sorting, and pagination.

The API is designed with a clean Express architecture using controllers, routes, middleware, validation, centralized error handling, and reusable utilities.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Role-based authorization for users and administrators
- Movie CRUD operations
- Search, filtering, sorting, and pagination
- Movie poster uploads with Cloudinary
- Separate endpoint for updating a movie poster
- Request validation with Joi
- Centralized error handling
- Async controller wrapper
- API rate limiting
- HTTP request logging with Morgan
- Swagger API documentation
- Environment-based configuration

## Tech Stack

| Category    |    Technology |
|-------------|---------------|
| Runtime           |     Node.js    |
| Framework         |    Express.js  |
| Database          |     MongoDB    |
| ODM               |      Mongoose  |
| Authentication    | JSON Web Token |
| Password Security |      bcrypt    |
| Validation        |        Joi     |
| Image Storage     |    Cloudinary  |
| File Upload       |      Multer    |
| API Documentation |      Swagger   |
| Logging           |      Morgan    |
| Security       |express-rate-limit |
| Code Quality   |  ESLint, Prettier |

## Project Structure

```text
ott-backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── movieController.js
│   ├── middlewares/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── upload.js
│   │   ├── validateMovie.js
│   │   └── validateMovieQuery.js
│   ├── models/
│   │   ├── Movie.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── movieRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── generateToken.js
│   ├── validations/
│   │   ├── movieQueryValidation.js
│   │   └── movieValidation.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package.json
└── README.md
```

## Getting Started

### Requirements

Before running the project, make sure you have:

- Node.js
- npm
- MongoDB or a MongoDB Atlas connection
- A Cloudinary account

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd ott-platform/ott-backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

You can use `.env.example` as a template:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not commit your real `.env` file or secret keys to GitHub.

## Running the Project

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

## API Documentation

Interactive Swagger documentation is available at:

```text
http://localhost:5000/api-docs
```

Swagger can be used to review endpoints, request formats, authentication requirements, and response schemas.

## Main API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |

### Movies

| Method |        Endpoint          | Access | Description                                              |
| GET    | `/api/movies`            | Public | Get movies with search, filters, sorting, and pagination |
| GET    | `/api/movies/:id`        | Public | Get one movie by ID                                      |
| POST   | `/api/movies`            | Admin  | Create a movie and upload its poster                     |
| PATCH  | `/api/movies/:id`        | Admin  | Update movie metadata                                    |
| PATCH  | `/api/movies/:id/poster` | Admin  | Replace a movie poster                                   | 
| DELETE | `/api/movies/:id`        | Admin  | Delete a movie                                           |

## Authentication

Protected routes require a JWT in the `Authorization` header:

```text
Authorization: Bearer <your-token>
```

Administrator-only endpoints additionally check the authenticated user's role.

## Image Uploads

Movie posters are uploaded using `multipart/form-data`.

The expected file field is:

```text
poster
```

Uploaded files are stored in Cloudinary, and the resulting image URL is saved in MongoDB.

## Error Handling

The project uses centralized error handling and returns consistent JSON responses.

Example:

```json
{
  "message": "Movie not found"
}
```

Common HTTP status codes used by the API:

| Status |     Meaning          |
|     |                         |
| 200 | Successful request      |
| 201 | Resource created        |
| 400 | Invalid request         |
| 401 | Authentication required |
| 403 | Access forbidden        |
| 404 | Resource not found      |
| 409 | Resource conflict       |
| 429 | Too many requests       |
| 500 | Internal server error   |

## Rate Limiting

The API limits the number of requests that can be made from one IP address during a configured time window.

When the limit is exceeded, the API returns:

```http
429 Too Many Requests
```

## Development Notes

- Controllers are wrapped with `asyncHandler` to forward asynchronous errors.
- Joi schemas validate movie data and query parameters.
- Mongoose validators are enabled during updates.
- Cloudinary poster uploads are separated from metadata updates.
- Morgan logs incoming HTTP requests during development.
- ESLint and Prettier help keep the codebase consistent.

## Frontend

A React frontend will be added to the `frontend` directory of the same repository and connected to this API.

Planned pages include:

- Home
- Movies catalog
- Movie details
- Login
- Registration
- Admin dashboard

The frontend will communicate with the backend through REST API requests.

## Future Improvements

- Automated tests
- Favorites and watchlists
- Reviews and ratings
- Refresh tokens
- Password reset flow
- Docker support
- Production deployment

## Author

**Sargis Hovsepyan**

Backend portfolio project created to demonstrate practical knowledge of Node.js, Express, MongoDB, REST API development, authentication, authorization, validation, security, and third-party service integration.