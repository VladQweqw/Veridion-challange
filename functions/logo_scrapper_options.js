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

function scanForLogo(parent, $, url) {
  // convert to an array
  const images_arr = parent.find("img").toArray();
  const href_arr = parent.find("a").toArray();

  // of -> return the element, in -> index
  for (let image of images_arr) {
    const image_class = $(image).attr("class"); // get the class of the image
    const image_src = $(image).attr("src"); // get the src of the image

    // if the image has logo somewhere in the class e.g first_hidden_logo_ we grab it and return it
    if (image_class?.includes("logo")) {
      return image_src;
    }
  }

  // this wont really affect the performance due to the fact that if it founds and image will return it asap so no code will run more than
  // if there is the case there is no image and no div with logo related ( note for website: please hire another developer ) we check the links and see which one is pointing to website domain
  
  for (let anchor of href_arr) {
    const href = $(anchor).attr("href"); // get the src of the image
    console.log(href);
    
    // if any href equals website domain i suppose it s a logo or home button, so we check for image files
    if (new URL(href).href === new URL(url).href) {
      const img_src = $(anchor).find("img").attr("src");
      return img_src;
    }
  }
  // if nothing is found we retur null
  return null;
}

function priority1($, website_url) {
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

  for (let idx in order) {
    // if we found the element we're looking for scan it for logos inside
    if (order[idx].length > 0) {

      const url = scanForLogo(order[idx], $, website_url);
      // if we found any logos, return them
      if (url != null) {
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

async function tryFetchLogo($, url) {
  const resp = { status: true, data: null }  
  const p0 = priority1($, url);
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