require("dotenv").config();
const mongoose = require("mongoose"); // database mongoose
const mongodb = require("mongodb"); // mongodb
const express = require("express");
const route = require("./routes/urlroute");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express(); // init express

// Basic Configuration - env variables config
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
// methods parsing built-in middlewares
app.use(cors()); // process headers
app.use(express.json()); // process data | json
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("/public"));
app.use("/public", express.static(`${process.cwd()}/public`)); //  hosts public files for front-end "/" home route

//--- database connect

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 /*server time out 5 seconds*/,
});
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "Connection error:"));
connection.once("open", () => {
  console.log("Mongodb database connection established successfully.");
});

// our api
app.use("/api/shorturl", route);
app.post("/", route);
// hosting homepage
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});



// ----- starts from here--------

// start server
const listener = app.listen(port, function () {
  console.log("Server is listning... on Port:" + listener.address().port);
});
