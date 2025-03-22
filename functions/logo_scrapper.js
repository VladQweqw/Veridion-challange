const axios = require("axios")
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// import utils module
const utils = require("./utils")
const options = require("./logo_scrapper_options")

// default image saving location
const SAVE_PATH = '../logos/';
const DIR_PATH = path.join(__dirname, "..", "logos")

// axios headers config to prevent 403 Fobridden erros
const headersConfig = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

function correctImageURL(image_url, website_url) {
  
  // a case where http is missing  
  if(image_url.startsWith("//")) {    
    image_url = "http:" + image_url;
    
    return image_url
  }
  
  
  // check if the logo url is relative e.g /etc/designs/logo .. if so append the website_url    
  if(!image_url.startsWith("http") && !image_url.startsWith("www")) {
    image_url = website_url + image_url.slice(image_url.indexOf("/"));
  }
  
  // if the logo is http://www.abc it means it a full valid path so we can return it
  return image_url;
}

async function downloadFile(image_url, website_url) {
  // make sure the directory exists
  utils.createDirectory(DIR_PATH);    
  
  try {
    // check function comments
    image_url = correctImageURL(image_url, website_url)
    
    // get the image as stream
    const resp = await axios({
      method: 'GET',
      url: image_url,
      responseType: 'stream',
      headers: headersConfig
    })
    
    // create the save path
    // dirname is /function, we need to go 1 dir up so "../logos_images" and the save name which is the domain of website + extension
    const save_path = path.join(
      __dirname, 
      SAVE_PATH, 
      utils.getDomainFromURL(website_url) + utils.getExtension(image_url)
    )

    // pass the save_path to writeStream and save the file
    const writer = fs.createWriteStream(save_path);

    return new Promise((resolve, reject) => {
      resp.data.pipe(writer);

      // if everything worked well display a message
      writer.on("finish", () => {
        console.log("|-> ✅ Logo saved succesfully!");
        resolve("SUCCESS")
      })

      // if there were erros throw Error and catch it later
      writer.on("error", (err) => {
        reject("FAILED")
      })
    })
    

  }catch(Exception) {
    console.log(`|-> ❌ Error downloading the logo`);
    // console.log(Exception);
    
  }
}

// fucntion to scrape image logo from websites
async function getLogoImagesFromURL(url) {
  try {
    // get the html and load it into cheerio
    const { data } = await axios.get(url, {
      headers: headersConfig
    });
    const $ = cheerio.load(data);
    
    // call another fucntion to try and fetch the logo by numerous tactics
    // tryFetchLogo data=> should return the path to the logo    
    const logos_arr = await options.tryFetchLogo($, url)
      
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
          return 
        };
      }  
    }else {
      // otherwise we haven't
      console.log(`❌ No logo images for for ${url}`)
    }
  }catch(Exception) {
    // catch the exception me or the beloved js may throw
    console.log("❌ An error occured");
    console.log(Exception);

    return false;
  }
}

// exporting functions
module.exports = {
    getLogoImagesFromURL,
}