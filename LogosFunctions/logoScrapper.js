const axios = require("axios")
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// import utils module
const helper = require("./helperFunctions")
const helperGroup = require("../GroupFunction/groupHelper")
const priorities = require("./logoPriorities")

// constants
const constants = require("../utils/constants")

async function downloadFile(image_url, website_url) {
  // make sure the directory exists
  const state = helperGroup.makeSureFolderExists(constants.LOGO_DIR_PATH);    
  if(state) {
    console.log(`|-> ✅ Directory logos is valid`);
  }

  try {
    // check function comments
    image_url = helper.correctImageURL(image_url, website_url)
    console.log(image_url);
    
    // get the image as stream
    const resp = await axios({
      method: 'GET',
      url: image_url,
      responseType: 'stream',
      headers: constants.headersConfig
    })
    
    // create the save path
    // dirname is /function, we need to go 1 dir up so "../logos_images" and the save name which is the domain of website + extension        
        
    const LOGO_DIR_NAME = path.join(
      __dirname, 
      constants.LOGO_DIR_NAME, 
      helper.getDomainFromURL(website_url) + helper.getExtension(image_url)
    )
    
    // pass the LOGO_DIR_NAME to writeStream and save the file
    const writer = fs.createWriteStream(LOGO_DIR_NAME);

    return new Promise((resolve, reject) => {
      resp.data.pipe(writer);

      // if everything worked well display a message
      writer.on("finish", () => {
        console.log("|-> ✅ Logo saved succesfully!");
        resolve("SUCCESS")
      })

      // if there were erros throw Error and catch it later
      writer.on("error", (err) => {
        reject("|-> ❌ Error saving the logo")        
      })
    })
    

  }catch(Exception) {
    console.log(`|-> ❌ Error fetching the logo`);        
  }
}

// fucntion to scrape image logo from websites
async function getWebsiteHTML(url) {
  try {
    // get the html and load it into cheerio
    const { data } = await axios.get(url, {
      headers: constants.headersConfig
    });
    const $ = cheerio.load(data);
    
    // call another fucntion to try and fetch the logo by numerous tactics
    // tryFetchLogo data=> should return the path to the logo    
    const logos_arr = await priorities.getWebsiteLogos($, url)
    
    // if the array has any items in it means we have found something
    if(logos_arr.length) {
      // ui message
      console.log(`🎉 Found ${logos_arr.length} logo${logos_arr.length > 1 ? "s" : ""}`)

      // loop over images only if there are any   
      for(let index in logos_arr) {        
        console.log(`|-> 🐌 Trying to fetch logo ${(Number(index) + 1)}`);
        
        const state = await downloadFile(logos_arr[index], url);
        
        // if a logo was succesfully downlaoded we can stop downlaoding the rest
        if(state === "SUCCESS") {
          return true
        };
      }  
    }else {
      // otherwise we haven't
      console.log(`❌ No logo images for for ${url}`)
    }
  }catch(Exception) {
    // catch the exception me or the beloved js may throw
    if(Exception.status === 403) {
      console.log("😔 Access not permitted");
    }else {
      console.log("❌ An error occured");
      
    }

    return false;
  }
}

// exporting functions
module.exports = {
  getWebsiteHTML,
}