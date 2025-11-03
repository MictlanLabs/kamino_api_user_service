import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kamino Users API',
      version: '1.0.0',
      description: 'API de gestión de usuarios con autenticación JWT',
      contact: {
        name: 'Soporte API',
        email: 'soporte@kamino.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://someday.app',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com'
            },
            firstName: {
              type: 'string',
              example: 'Juan'
            },
            lastName: {
              type: 'string',
              example: 'Pérez'
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
              example: 'USER'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com'
            },
            password: {
              type: 'string',
              minLength: 8,
              example: 'password123'
            },
            firstName: {
              type: 'string',
              example: 'Juan'
            },
            lastName: {
              type: 'string',
              example: 'Pérez'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Mensaje de error'
            }
          }
        }
      }
    }
  },
  apis: ['./src/infrastructure/adapters/input/routes/*.js']
};

export default swaggerJsdoc(options);