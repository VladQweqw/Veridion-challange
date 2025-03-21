function isImageLogo(alt) {
  // LoGo / LOGO / AWcLoGo will all match, and therefore we have found a logo
  if (alt.toLocaleLowerCase().includes('logo')) {
    return true;
  }
  // default return false
  return false;
}

async function loopImages(images, $, url) {
  let flag = true;

  for (let image of images) {
    // create a constat of current image file
    const image_el = $(image);

    // get the alt and src attribute
    let alt = image_el.attr("alt") || "";
    let src = image_el.attr("src");

    // check if the current image is a logo, based on alt attribute
    if (isImageLogo(alt)) {
      // if so, we print a status message for UI
      console.log(`✅ Logo found by alt ${alt}, src: ${src}`);
      flag = false;

      // download the file
      // return true / false if was success or not
      return await downloadFile(src, url)
    }
  }
  if (flag) {
    console.log(`❌ No logo images for for ${url}`)
    return false;
  }
}

function priority0($) {
  const resp = { status: true, data: null }

  let relIcon = $(`link[rel="icon"]`).attr("href");
  let metaIcon = $(`meta[property="og:image"]`).attr("content");
  let twitterIcon = $(`meta[property="twitter:image"]`).attr("content");

  if (relIcon) {
    resp.data = relIcon;
    return resp;
  }

  if (metaIcon) {
    resp.data = metaIcon;
    return resp;
  }

  if (twitterIcon) {
    resp.data = twitterIcon;
    return resp;
  }

  resp.status = false
  return resp;
}

function scanForLogo(parent, $){
  // convert to an array
  const images_arr = parent.find("img").toArray();
  
  // of -> return the element, in -> index
  for(let image of images_arr) {
    const image_class = $(image).attr("class"); // get the class of the image
    const image_src = $(image).attr("src"); // get the src of the image

    // if the image has logo somewhere in the class e.g first_hidden_logo_ we grab it and return it
    if(image_class?.includes("logo")) {      
      return image_src;
    }
  }

  // if nothing is found we retur null
  return null;
}

function priority1($) {
  // a response model for response
  const resp = { status: true, data: null }

  // selection each element in other i think will appear
  let div_navbar = $("div.navbar");
  let div_header = $("div.header")
  let header = $("header")
  let nav = $("nav")

  // order in which the for will iterate, from the most probably place for a logo to be to least
  const order = [
    div_navbar,
    div_header,
    header,
    nav
  ]

  for(let idx in order) {
    // if we found the element we're looking for scan it for logos inside
    if(order[idx].length > 0) {
      const url = scanForLogo(order[idx], $);
      // if we found any logos, return them
      if(url != null) {
          resp.data = url;
          return resp;
      }

      // otherwise continue
    }
  }

  // default return in case nothing is found
  resp.status = false;
  return resp;
}


async function tryFetchLogo($) {
  const resp = { status: true, data: null }
  const p0 = priority1($);
  // const p2 = priority2($);

  if (p0.status) {
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