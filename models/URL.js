const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    orignal_url:String,
    short_url:String
});

module.exports = mongoose.model("URL", UrlSchema);