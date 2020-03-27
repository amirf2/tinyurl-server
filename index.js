dotenv = require('dotenv')
dotenv.config();

const express         = require("express"),
      cors            = require("cors"),
      bodyParser      = require("body-parser"),
      mongoose        = require("mongoose"),
      shortid         = require("shortid");
      isValidUrl      = require("is-url");
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
 * @route POST /new
 * @group TinyURL
 * @param {string} fullURL.query.required - Original URL / Full URL , for example: /new?fullURL=http://www.google.com
 * @returns {TinyURL} 200 - TinyURL
 */

app.post('/new', async (req, res) => {
    const {fullURL} = req.query;
    try {
        const tinyURL = await TinyURL.findOne({fullURL});
        if (tinyURL){ // Check if URL is already exist
            res.json(tinyURL)
        } else {
            let randomID = shortid.generate();   // Generate unique id and create TinyURL
            let tinyURL = { fullURL, tinyURL: `${SERVER_URL}/${randomID}`, shortid: randomID};
            const newTinyURL = await TinyURL.create(tinyURL);
            res.json(newTinyURL)
        }
    } catch (e) {
        console.log(e);
        res.status(500).json("Error")
    }
});


/**
 * This function comment is parsed by doctrine
 * @route GET /{tinyUrlPath}
 * @group TinyURL
 * @param {string} tinyUrlPath.path.required - TinyURLPath, for example: /a4kLcz
 * @produces text/html
 * @returns {object} 200 - Redirect to Full URL
 */

app.get('/:tinyUrlPath', async (req, res) => {
    const {tinyUrlPath} = req.params;
    try {
        const URL = await TinyURL.findOne({shortid: tinyUrlPath});
        /*****************************************************************
          if we found TinyUrl in the DB we'll redirect to the full url,
          based on if the domain has www or http:// prefix, or not. 
        ******************************************************************/
        if (URL){ 
            const {fullURL} = URL;
            if (isValidUrl(fullURL)){
                res.redirect(fullURL);
            } else res.redirect(`//${fullURL}`);
        } else res.json(URL);
    } catch (e) {
        res.status(500).json("Error")
    }
});


app.use((req, res) => {
    res.redirect("/api-docs");
});


server = app.listen(PORT, function () {
    console.log(`TinyURL Server listening.. Access it using address: ${SERVER_URL}`);
});


