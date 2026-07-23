const swaggerJsdoc = require("swagger-jsdoc");

// Настройки Swagger.
const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "OTT Backend API",
            version: "1.0.0",
            description: "API documentation for the OTT Backend project.",
        },

        servers: [
            {
                url: "http://localhost:3000",
            },
        ],

        components: {
            schemas: {
                Movie: {
                    type: "object",
                    required: [
                        "title",
                        "year",
                        "genre",
                        "description",
                        "rating",
                        "poster",
                    ],
                    properties: {
                        _id: {
                            type: "string",
                            example: "687b13c91a89f5e2a7d9a4fd",
                        },

                        title: {
                            type: "string",
                            example: "Avatar",
                        },

                        year: {
                            type: "integer",
                            example: 2022,
                        },

                        genre: {
                            type: "string",
                            example: "Sci-Fi",
                        },

                        description: {
                            type: "string",
                            example: "Epic science fiction movie.",
                        },

                        rating: {
                            type: "number",
                            example: 8.5,
                        },

                        poster: {
                            type: "string",
                            example: "https://res.cloudinary.com/your-cloud/image/upload/example.jpg",
                        },

                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },

                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                MovieListResponse: {
                    type: "object",
                    properties: {
                        total: {
                            type: "integer",
                            example: 13,
                        },
                        totalPages: {
                            type: "integer",
                            example: 2,
                        },
                        page: {
                            type: "integer",
                            example: 1,
                        },
                        limit: {
                            type: "integer",
                            example: 10,
                        },
                        movies: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Movie",
                            },
                        },
                    },
                },

                RegisterRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            example: "user1",
                        },

                        email: {
                            type: "string",
                            example: "user1@gmail.com",
                        },

                        password: {
                            type: "string",
                            example: "123456",
                        },
                    },
                },

                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "687b13c91a89f5e2a7d9a4fd",
                        },

                        name: {
                            type: "string",
                            example: "user1",
                        },

                        email: {
                            type: "string",
                            example: "user1@gmail.com",
                        },

                        role: {
                            type: "string",
                            example: "user",
                        },

                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                RegisterResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "User registered successfully",
                        },

                        user: {
                            $ref: "#/components/schemas/User",
                        },
                    },
                },

                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            example: "user1@gmail.com",
                        },

                        password: {
                            type: "string",
                            example: "123456",
                        },
                    },
                },

                LoginResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Login successful",
                        },

                        user: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example: "687b13c91a89f5e2a7d9a4fd",
                                },

                                name: {
                                    type: "string",
                                    example: "user1",
                                },

                                email: {
                                    type: "string",
                                    example: "user1@gmail.com",
                                },

                                role: {
                                    type: "string",
                                    example: "user",
                                },
                            },
                        },

                        token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                    },
                },


                ErrorResponse: {
                    type: "object",
                    required: ["message"],
                    properties: {
                        message: {
                            type: "string",
                            example: "Something went wrong",
                        },
                    },
                },


            },

            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },

    apis: ["./src/routes/*.js"],
};

// Создаем Swagger-документацию.
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;