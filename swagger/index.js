
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            description: 'make tiny url',
            title: 'TinyURL API',
            version: '1.0.0',
        },
        host: 'localhost:8000',
        basePath: '/',
        produces: [
            "application/json",
        ]
    },
    basedir: __dirname, //app absolute path
    files: ['../index.js', '../models/*'] //Path to the API handle folder
};

module.exports = swaggerOptions;