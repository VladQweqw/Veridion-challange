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
  
        // download the file
        // return true / false if was success or not
        return await downloadFile(src, url)
      }
    }
    if(flag) {
      console.log(`❌ No logo images for for ${url}`)
      return false;
    }
  }

function priority0($) {
    const resp = {status: true, data: null}
    
    let relIcon = $(`link[rel="icon"]`).attr("href");
    let metaIcon = $(`meta[property="og:image"]`).attr("content");
    let twitterIcon = $(`meta[property="twitter:image"]`).attr("content");
    
    if(relIcon) {
        resp.data = relIcon;
        return resp;
    }
    
    if(metaIcon) {
        resp.data = metaIcon;
        return resp;
    }

    if(twitterIcon) {
        resp.data = twitterIcon;
        return resp;
    }

    resp.status = false
    return resp;
}

function priority2($) {
    const resp = {status: true, data: null}
    const headerMaybe = $("header");

    
    return resp;
}

function priority3($) {
    
}

function priority4($) {
    
}

async function tryFetchLogo($) {
    const resp = {status: true, data: null}
    const p0 = priority0($);
    // const p2 = priority2($);

    if(p0.status) {
        resp.data = p0.data;
        console.log(`✅ Logo found in <head>`)
        return resp;
    }

    // if(p2.status) {
    //     resp.data = p2.data;
    //     return resp;
    // }




    resp.status = false;
    return resp;
}

module.exports = {
    tryFetchLogo
}