const axios = require("axios")
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// import utils module
const utils = require("./utils")

// default image saving location
const SAVE_PATH = '../logos/';
const DIR_PATH = path.join(__dirname, "..", "logos")

// axios headers config to prevent 403 Fobridden erros
const headersConfig = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

async function downloadFile(image_url, website_url) {
  // make sure the directory exists
  utils.createDirectory(DIR_PATH);  

  try {
    // check if the logo url is relative e.g /etc/designs/logo .. if so append the website_url
    if(!image_url.startsWith("http")) {
      image_url = website_url + image_url
    }
    
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
    resp.data.pipe(writer);
    
    // if everything worked well display a message
    writer.on("finish", () => {
      console.log("✔ Image saved succsfully!");
    })
    
    // if there were erros throw Error and catch it later
    writer.on("error", (err) => {
      throw new Error(err)
    })
  }catch(Exception) {
    console.log(`❌ Error downloading the logo`);
    console.log(Exception);
    
  }
}

function isImageLogo(alt) {    
  // LoGo / LOGO / AWcLoGo will all match, and therefore we have found a logo
  if(alt.toLocaleLowerCase().includes('logo')) {
    return true;
  }
  // default return false
  return false;
}

async function loopImages(images, $, url) {
  let flag = true;

  for(let image of images) { 
    // create a constat of current image file
    const image_el = $(image);
    
    // get the alt and src attribute
    let alt = image_el.attr("alt") || "";
    let src = image_el.attr("src");
    
    // check if the current image is a logo, based on alt attribute
    if(isImageLogo(alt)) {
      // if so, we print a status message for UI
      console.log(`✅ Logo found by alt ${alt}, src: ${src}`);
      flag = false;
      // downlaod the file
      await downloadFile(src, url);

      // if we found an logo, we can skip the rest
      break;
    }
    
  }
  if(flag) {
    console.log(`❌ No logo images for for ${url}`)
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
    
    // first check if there are any iamges in header
    let images = $("header img").toArray()
    // let images = []

    // if there are no images, we need to check all iamges for alt attributes which contains logo
    if(!images.length) {
      // we need another aproach to get the logo ( if there is one) we can scan all images from the page.      
      images = $("img").toArray();
        

      // if there are no images to iterate
      if(images.length <= 0) {
        throw new Error(`❌ No logo images for for ${url}`)
      }
    }

    // loop over images only if there are any
    loopImages(images, $, url)
  }catch(Exception) {
    // catch the exception me or the beloved js may throw
    console.log("❌ Error while fetching websites HTML");
    console.log(Exception);
    
  }
}

// exporting functions
module.exports = {
    getLogoImagesFromURL,
}