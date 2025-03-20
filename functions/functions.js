const axios = require("axios")
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// default image saving location
const SAVE_PATH = '../logos_images/';
function getDomainFromURL(url) {
  // build in js function 
  const urlObj = new URL(url);

  // getting the hostname from url
  return urlObj.hostname;
}

function getExtension(path) {
  // get the last . from path for example .abc.png 
  const idx = path.lastIndexOf(".");

  // then return from that index to end 
  return path.slice(idx); 
}

// make sure the directory exists
fs.mkdirSync(path.dirname(SAVE_PATH), { recursive: true });


async function downloadFile(url) {
  try {
    // get the image as stream
    const resp = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    })
    
    // create the save path
    // dirname is /function, we need to go 1 dir up so "../logos_images" and the save name which is the domain of website + extension
    const save_path = path.join(__dirname, '../logos_images', getDomainFromURL(url) + getExtension(url))

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
    console.log(`Error downloading ${Exception}`);
  }
}

// fucntion to scrape image logo from websites
async function getLogoImagesFromURL(url) {
  
  function isImageLogo(alt) {    
    // LoGo / LOGO / AWcLoGo will all match, and therefore we have found a logo
    if(alt.toLocaleLowerCase().includes('logo')) {
      return true;
    }
    // default return false
    return false;
  }

  async function loopImages(images, $) {
    for(let image of images) { 
      // create a constat of current image file
      const image_el = $(image);
      
      // get the alt and src attribute
      let alt = image_el.attr("alt");
      let src = image_el.attr("src");

      // check if the current image is a logo, based on alt attribute
      if(isImageLogo(alt)) {
        // if so, we print a status message for UI
        console.log(`✅ Logo found by alt ${alt}, src: ${src}`);

        // downlaod the file
        await downloadFile(src);

        // if we found an logo, we can skip the rest
        break;
      }
      
    }
  }

  try {
    // get the html and load it into cheerio
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // first check if there are any iamges in header
    let images = $("header img").toArray()
    // let images = []

    // if there are no images, we need to check all iamges for alt attributes which contains logo
    if(!images.length) {
      // we need another aproach to get the logo ( if there is one) we can scan all images from the apge.      
      images = $('img').map(function() {
        console.log(this);
        
      });
                  
      // if there are no images to iterate
      if(images.length <= 0) {
        throw new Error(`❌ No logo images for for ${url}`)
      }
    }

    // loop over images only if there are any
    loopImages(images, $)

    // dispaly a space between for UI
    console.log("\n");
  }catch(Exception) {
    // catch the exception me or the beloved js may throw
    console.log(Exception);
  }
}

// exporting functions
module.exports = {
    getLogoImagesFromURL,
    getDomainFromURL
}