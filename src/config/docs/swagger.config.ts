import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Exploradores API",
      version: "1.0.0",
      description: "Documentacion del microservicio de Exploradores"
    },
    servers: [
      {
        url: `http://${process.env.API_BASE_URL_LOCAL ?? "localhost"}:${process.env.EXPRESS_PORT ?? "3010"}`,
        description: "Servidor local"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    "./src/modules/auth/routers/*.ts",
    "./src/modules/explorers/routers/*.ts",
    "./src/modules/commanders/routers/*.ts"
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
