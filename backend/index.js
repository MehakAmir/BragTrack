const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Brag API',
            version: '1.0.0',
            description: 'API for managing achievements',
        },
        servers: [
            {
                url: 'http://localhost:3000', 
            },
            
        ],
        
      
    },
    apis: ['./routes/user.js','server.js'], 
 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//http://localhost:3000/api-docs/#/


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/user', userRoute);


module.exports = app;




