
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            description: 'make tiny url',
            title: 'TinyURL API',
            version: '1.0.0',
        },
        host: 'tinyurl3.herokuapp.com',
        basePath: '/',
        produces: [
            "application/json",
            "text/html",
            "text/plain"
        ],
        paths: {}
    },
    basedir: __dirname, //app absolute path
    files: ['../index.js', '../models/*'], //Path to the API handle folder
    paths: {}
};

module.exports = swaggerOptions;