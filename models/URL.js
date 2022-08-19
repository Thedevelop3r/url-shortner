const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    orignal_url:String,
    short_url:{
        type:Number,
        unique:true
    }
});

module.exports = mongoose.model("URL", UrlSchema);