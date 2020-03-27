const mongoose = require("mongoose");

/**
 * @typedef TinyURL
 * @property {string} originalURL.required
 * @property {string} tinyURL.required
 * @property {string} shortid.required
 */
const tinyURLSchema = new mongoose.Schema({
    originalURL: String,
    tinyURL: String,
    shortid: String
});

module.exports = mongoose.model("TinyURL", tinyURLSchema);