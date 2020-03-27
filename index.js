dotenv = require('dotenv')
dotenv.config();

const express         = require("express"),
      cors            = require("cors"),
      bodyParser      = require("body-parser"),
      mongoose        = require("mongoose"),
      shortid         = require("shortid");
      isUrl           = require("is-url");
      TinyURL         = require("./models/TinyURL"),
      swaggerOptions  = require("./swagger/index.js"),
      app             = express();
      expressSwagger  = require('express-swagger-generator')(app);
      PORT            = process.env.PORT || 8000;
      SERVER_URL      = process.env.SERVER_URL || "http://localhost:8000"
      MongoDB_URL     = process.env.MONGODB_URL || "mongodb://localhost/tinyurl";
      MongoDB_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }


expressSwagger(swaggerOptions)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


mongoose.connect(MongoDB_URL, MongoDB_OPTIONS, (error) => {
    if (error) {
        console.log(`error: ${error}`);
    } else {
        console.log(`Connected to DB`);
    }
});


app.get('/', async (req, res, next) => {
    res.redirect("/api-docs");
});


/**
 * This function comment is parsed by doctrine
 * @route POST /url
 * @group TinyURL
 * @param {string} originalURL.query.required - Original URL / Full URL , for example: http://www.google.com
 */
app.post('/url', async (req, res, next) => {
    const {originalURL} = req.query;
    TinyURL.findOne({originalURL: originalURL}, (err, URL) => {
        if (err){
            console.log(err);
            res.status(500).json("Error")
        } else if (URL) {
            res.json(URL);
        } else {
            let randomID = shortid.generate();
            let newURL = { originalURL: originalURL, tinyURL: `${SERVER_URL}/${randomID}`, shortid: randomID};
            TinyURL.create(newURL, (err, URL) => {
                if (err){
                    console.log(err);
                    res.status(500).json("Error")
                } else {
                    res.json(URL);
                }
            });
        } 
    });
});


/**
 * This function comment is parsed by doctrine
 * @route GET /:tinyUrlPath
 * @group TinyURL
 * @param {string} tinyUrlPath.path.required - TinyURLPath, for example: "a4kLcz"
 * @returns {object} 200 - TinyURL
 */
app.get('/:tinyUrlPath', async (req, res, next) => {
    const {tinyUrlPath} = req.params;
    TinyURL.findOne({shortid: tinyUrlPath}, (err, URL) => {
        if (err){
            console.log(err, 'Error during get TinyURL');
            res.status(500).send('Error during get TinyURL');
        } else {
            if (URL){
                const {originalURL} = URL;
                if (isUrl(originalURL)){
                    res.redirect(originalURL);
                }
                else res.redirect(`//${originalURL}`);
            }
            else res.json("");
        }
    });
});


app.use((req, res) => {
    res.redirect("/api-docs");
});


server = app.listen(PORT, function () {
    console.log(`TinyURL Server listening.. Access it using address: ${SERVER_URL}`);
});