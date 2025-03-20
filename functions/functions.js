const axios = require("axios")
const cheerio = require("cheerio");

const SAVE_PATH = '../logos_images/';

function downloadFile(url) {
  const client = url.startsWith("https") ? https : http;

  client.get(url, (response) => {
    if(response.status === 200) {
      
    }
  })
}

// fucntion to scrape image logo from websites
async function getLogoImagesFromURL(url) {

  function isImageLogo(alt) {
    console.log(alt);
    
    // LoGo / LOGO / AWcLoGo will all match, and therefore we have found a logo
    if(alt.toLocaleLowerCase().includes('logo')) {
      return true;
    }

    // default return false
    return false;
  }

  function loopImages(images, $) {
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

        // if we found an logo, we can skip the rest
        break;
        // downlaod the file
        // downloadFile(src);
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
  }catch(Exception) {
    // catch the exception me or the beloved js may throw
    console.log(Exception);
  }
}

// exporting functions
module.exports = {
    getLogoImagesFromURL
}