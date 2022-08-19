const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");
const URL = require("../models/URL");
const route = express.Router();

// routes with middlewares
route.post("/", async function (req, res) {
  console.warn(
    "New Short-Url Request Received by Ip:" + req.ip + " Path: " + req.path
  );
  let url = req.body.url_input;
  const urlCode = shortid.generate();

  if(!url){
    url = req.body.url;
  }
  console.log("User Sent a new short Url Request for:> " + url);
  console.log("Created a Temp short URL before validation:> " + urlCode);
  console.warn("Url validation in progress...");
  // check if the url is valid?
  if (!validUrl.isWebUri(url)) {
    console.error("Url validation failed: Invalid url provided!");
    res.status(400).json({
      error: "Invalid URL",
    });
  } else {
    console.log("Url validation passed!");
    console.warn("Url already exists?... validating...");
    try {
      // check if its already in the database
      let findOne = await URL.findOne({
        orignal_url: url,
      });
      if (findOne) {
        console.log(
          "Url already exists! as: " +
            findOne.short_url +
            " >sending user the existing url...~Sent"
        );
        res.json({
          orignal_url: findOne.orignal_url,
          short_url: findOne.short_url,
        });
      } else {
        // if it doesnt exist create a new url and respond
        console.warn("Url does'nt exist! creating a new short url...");
        findOne = new URL({
          orignal_url: url,
          short_url: urlCode,
        });
        console.log("Url created successfull!");
        console.log(
          "Url: orignal url: " +
            findOne.orignal_url +
            " short url: " +
            findOne.short_url
        );
        await findOne.save();
        res.json({
          orignal_url: findOne.orignal_url,
          short_url: findOne.short_url,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("server error...");
    }
  }
}); // create new url

route.get("/:short_url?", async function (req, res) {
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
        console.log("Url Found! Redirecting user to "+ urlParams.orignal_url);
      return res.redirect(urlParams.orignal_url);
    } else {
        console.warn("Url Not Found!");
      return res.status(400).json("No Url Found!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

module.exports = route;
