const mongoose = require("mongoose");

/**
 * @typedef TinyURL
 * @property {string} fullURL.required
 * @property {string} tinyURL.required
 * @property {string} shortid.required
 */
const tinyURLSchema = new mongoose.Schema({
    fullURL: String,
    tinyURL: String,
    shortid: String
});

module.exports = mongoose.model("TinyURL", tinyURLSchema);