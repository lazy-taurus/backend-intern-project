const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Intern Project API',
      version: '1.0.0',
      description: 'Scalable REST API with Authentication & Role-Based Access for Task Management',
      contact: {
        name: 'Backend Developer Intern',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
            user: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'securepassword123' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' }
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            409: { description: 'User already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login user and get token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'securepassword123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful, returns JWT' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/tasks': {
        get: {
          summary: 'Get all tasks (Paginated)',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' }, description: 'Page number' },
            { name: 'limit', in: 'query', schema: { type: 'integer' }, description: 'Items per page' },
            { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filter by status' },
          ],
          responses: {
            200: { description: 'List of tasks retrieved successfully' },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          summary: 'Create a new task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', example: 'Complete backend assignment' },
                    description: { type: 'string', example: 'Add Swagger docs' },
                    status: { type: 'string', example: 'pending' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Task created successfully' },
            400: { description: 'Validation Error' },
          },
        },
      },
      '/tasks/{id}': {
        delete: {
          summary: 'Delete a task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Task ID' },
          ],
          responses: {
            200: { description: 'Task removed successfully' },
            403: { description: 'Not authorized to delete this task' },
            404: { description: 'Task not found' },
          },
        },
      },
    },
  },
  apis: [], 
};

module.exports = swaggerJsDoc(swaggerOptions);