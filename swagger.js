const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
openapi: '3.0.0',
info: {
title: 'API ELEIÇÕES',
version: '1.0.0',
description: 'API para controle da votação.',
},
};

const options = {
swaggerDefinition,
apis: ['swagger_endpoints.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;