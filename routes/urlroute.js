const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");
const URL = require("../models/URL");
const route = express.Router();

// routes with middlewares
// create a new url
route.post("/", async function (req, res) {
  console.log("-".repeat(40));
  console.warn(
    "New Short-Url Request Received by Ip:" + req.ip + " Path: " + req.path
  );
  let url = req.body.url_input;
  let urlCode = shortid.generate();

  if(!url){
    url = req.body.url;
  }
  console.log("User Sent a new short Url Request for:> " + url);
  console.log("Created a Temp short URL before validation:> " + urlCode);
  console.warn("Url validation in progress...");
  // check if the url is valid?
  if (!validUrl.isWebUri(url)) {
    console.error("Url validation failed: Invalid url provided!");
    console.log("-".repeat(40));
    res.json({
      error: "invalid url",
    });
  } else {
    console.log("Url validation passed!");
    console.warn("Url already exists?... validating...");
    try {
      // check if its already in the database
      let findOne = await URL.findOne({
        original_url: url,
      });
      if (findOne) {
        console.log(
          "Url already exists! as: " +
            findOne.short_url +
            " >sending user the existing url...~Sent"
        );
        console.log("-".repeat(40));
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url,
        });
      } else {
        // if it doesnt exist create a new url and respond
        console.warn("Url does'nt exist! creating a new short url...");

        let totaldocs = await URL.find();
        urlCode = totaldocs.length + 1;
        console.log("Assigning Short Url : "+ urlCode);
        findOne = new URL({
          original_url: url,
          short_url: urlCode,
        });
        console.log("Url created successfull!");
        console.log(
          "Url: original url: " +
            findOne.original_url +
            " short url: " +
            findOne.short_url
        );
        await findOne.save();
        console.log("-".repeat(40));
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("server error...");
    }
  }
});

// get a short url
route.get("/:short_url?", async function (req, res) {
  console.log("-".repeat(40));
  console.warn(
    "Redirect to Short-Url Request Received by Ip:" + req.ip + " Path: " + req.path
  );
  console.log("User Sent a Redirect-To-Short-Url Request for:> " + req.params.short_url);
  try {
    console.warn("Url search in progress...");
    const urlParams = await URL.findOne({
      short_url: req.params.short_url,
    });
    // if found
    if (urlParams) {
        console.log("Url Found! Redirecting user to "+ urlParams.original_url);
        console.log("-".repeat(40));
      return res.redirect(urlParams.original_url);
    } else {
        console.warn("Url Not Found!");
        console.log("-".repeat(40));
      return res.status(400).json("No Url Found!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

module.exports = route;
