import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QARMenu API',
      version: '1.0.0',
      description: 'QARMenu API Documentation',
    },
    servers: [
      {
        url: 'https://qarmenubackend-production.up.railway.app',
        description: 'Production server',
      }
    ],
  },
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs }; 