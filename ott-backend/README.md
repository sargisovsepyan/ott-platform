# Lumio Backend API

REST API for the Lumio OTT streaming platform, built with Node.js, Express, MongoDB, and Mongoose.

The backend handles authentication, authorization, movie management, media uploads, homepage configuration, user administration, validation, rate limiting, and centralized error handling.

## Live API

```text
https://lumio-api-kpsv.onrender.com
```

Swagger documentation:

```text
https://lumio-api-kpsv.onrender.com/api-docs
```

> The backend is hosted on the free Render plan. The first request after a period of inactivity may take several seconds while the server starts.

## Features

- User registration and login
- Password hashing with bcryptjs
- JWT authentication
- User and administrator roles
- Protected admin routes
- Movie CRUD operations
- Search, filtering, sorting, and pagination
- Poster uploads through Cloudinary
- Movie video uploads through Cloudinary
- Default Coming Soon video
- Homepage movie configuration
- Admin user management
- Request validation with Joi
- Centralized error handling
- Global and authentication rate limiting
- CORS configuration
- HTTP request logging with Morgan
- Swagger API documentation

## Technologies

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token |
| Password hashing | bcryptjs |
| Validation | Joi |
| Media storage | Cloudinary |
| File uploads | Multer |
| API documentation | Swagger |
| Logging | Morgan |
| Rate limiting | express-rate-limit |
| CORS | cors |
| Code quality | ESLint and Prettier |

## Project Structure

```text
ott-backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── adminUserController.js
│   │   ├── authController.js
│   │   ├── homepageController.js
│   │   └── movieController.js
│   ├── middlewares/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── authRateLimiter.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── upload.js
│   │   ├── uploadVideo.js
│   │   ├── validateHomepageConfig.js
│   │   ├── validateMovie.js
│   │   └── validateMovieQuery.js
│   ├── models/
│   │   ├── HomepageConfig.js
│   │   ├── Movie.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminUserRoutes.js
│   │   ├── authRoutes.js
│   │   ├── homepageRoutes.js
│   │   └── movieRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   └── serializeMovie.js
│   ├── validations/
│   │   ├── homepageValidation.js
│   │   ├── movieQueryValidation.js
│   │   └── movieValidation.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── package-lock.json
├── package.json
└── README.md
```

## Installation

Clone the repository and open the backend directory:

```bash
git clone <repository-url>
cd ott-platform/ott-backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file inside the `ott-backend` directory.

Use `.env.example` as a template:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

DEFAULT_COMING_SOON_VIDEO_URL=
CLIENT_ORIGINS=http://localhost:5173
```

Never commit real passwords, API keys, database credentials, or `.env` files.

## Running the Backend

Start the development server:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

Run ESLint:

```bash
npm run lint
```

The API will be available at:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication

| Method |       Endpoint       | Access | Description              |
|--------|----------------------|--------|--------------------------|
|  POST  | `/api/auth/register` | Public | Register a new user      |
|  POST  | `/api/auth/login`    | Public | Log in and receive a JWT |

### Movies

| Method |          Endpoint           |   Access |                    Description                           |
|--------|---------------------------- |----------|----------------------------------------------------------|
|  GET   | `/api/movies`               |   Public | Get movies with search, filters, sorting, and pagination |
|  GET   | `/api/movies/:id`           |   Public | Get a movie by ID                                        |
|  POST  | `/api/movies`               |   Admin  | Create a movie with a poster                             |
| PATCH  | `/api/movies/:id`           |   Admin  | Update movie information                                 |
| PATCH  | `/api/movies/:id/poster`    |   Admin  | Replace a movie poster                                   |
| PATCH  | `/api/movies/:id/video`     |   Admin  | Upload or replace a movie video                          |
| DELETE | `/api/movies/:id/video`     |   Admin  | Delete a custom movie video                              | 
| DELETE | `/api/movies/:id`           |   Admin  | Delete a movie                                           |

### Homepage

| Method |      Endpoint          | Access |             Description                  |
|--------|------------------------|--------|------------------------------------------|
|  GET   | `/api/homepage`        | Public | Get movies configured for the homepage   |
|  GET   | `/api/homepage/config` | Admin  | Get the complete homepage configuration  |
|  PUT   | `/api/homepage/config` | Admin  | Update homepage movies and display count |

### Admin Users

| Method |       Endpoint         | Access |                Description                            |
|--------|------------------------|--------|-------------------------------------------------------|
| GET    | `/api/admin/users`     | Admin  | Get users with search, role filtering, and pagination |
| DELETE | `/api/admin/users/:id` | Admin  | Delete a user                                         |

## Authentication

Protected routes require a JWT in the `Authorization` header:

```text
Authorization: Bearer <your-token>
```

Administrator routes also verify that the authenticated user has the `admin` role.

## Movie Queries

The movie catalogue supports query parameters such as:

```text
GET /api/movies?search=harbor&genre=Drama&year=2025&page=1&limit=10&sort=-rating
```

Supported functionality includes:

- Search by movie title
- Filter by genre
- Filter by year
- Sort by title, year, or rating
- Pagination

## Media Uploads

Posters and videos are uploaded using `multipart/form-data`.

Poster field:

```text
poster
```

Video field:

```text
video
```

Uploaded files are stored in Cloudinary. Their URLs and video metadata are saved in MongoDB.

When a movie has no custom video, the API can return the URL from:

```env
DEFAULT_COMING_SOON_VIDEO_URL=
```

## Homepage Configuration

The administrator can select between 1 and 10 movies for the homepage.

The configuration stores:

- Selected movie IDs
- Movie display order
- Number of visible movies

When a movie is deleted, it is also removed from the homepage configuration.

## Admin User Management

Administrators can:

- View users
- Search by name or email
- Filter users by role
- Use pagination
- Delete users

The backend prevents an administrator from deleting their own account and prevents deletion of the final administrator.

## Rate Limiting

The backend uses two rate limiters:

- A general limiter for normal API usage
- A stricter limiter for registration and login routes

If a limit is exceeded, the API returns:

```http
429 Too Many Requests
```

Example response:

```json
{
  "message": "Too many requests, please try again later."
}
```

## Error Handling

The project uses centralized error handling and returns JSON responses.

Example:

```json
{
  "message": "Movie not found"
}
```

Common HTTP status codes:

| Status |            Meaning             |
|--------|--------------------------------|
| 200    | Request completed successfully |
| 201    | Resource created successfully  |
| 400    | Invalid request data           |
| 401    | Authentication required        |
| 403    | Access forbidden               |
| 404    | Resource not found             |
| 409    | Resource conflict              |
| 429    | Too many requests              |
| 500    | Internal server error          |

## Deployment

The backend is deployed using:

- Render for hosting
- MongoDB Atlas for the production database
- Cloudinary for posters and videos
- Vercel for the frontend

The frontend domain must be included in:

```env
CLIENT_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

## Future Improvements

- Email verification
- Forgot password and password reset
- Change password
- Refresh tokens
- Automated tests
- Favorites and watchlists
- Continue watching
- Improved production logging

## Author

**Sargis Hovsepyan**

Backend portfolio project created to demonstrate practical knowledge of Node.js, Express, MongoDB, REST APIs, authentication, authorization, validation, security, media uploads, and production deployment.