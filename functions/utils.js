const fs = require("fs");
const headersConfig = require("./constants");
const axios = require("axios")


function getDomainFromURL(url) {
    // build in js function 
    const urlObj = new URL(url);
    
    // getting the hostname from url
    return urlObj.hostname;
}

function getExtension(path) {
    // get the last . from path for example .abc.png 
    const start_idx = path.lastIndexOf(".");
    let end_idx = start_idx;
    
    // so, if the url has some paramaterts to it like ?v=2312q3&x=213 we ignore them and get only the extension
    for(end_idx = start_idx; end_idx < path.length; end_idx++) {
        // using ascii table, we check for a-z and A-Z alphabet letter
        let code = path.charCodeAt(end_idx);
        if (!(code >= 65 && code <= 90) && !(code >= 97 && code <= 122)) {
            // if we found somethign that isn't right, we break
            break;
        }
    }
    
    // then return from that index to end     
    return path.slice(start_idx, end_idx);

}

function createDirectory(path) {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            console.log("|-> ✅ Directory created");
        } else {
            console.log("|-> ✅ Directory already exists");
        }
    } catch (err) {
        console.log(`|-> ❌ ${err}`);
    }
}

async function getProperURL(url) {
    const https_www = "https://www." + url;
    const https = "https://" + url;
    const http_www = "http://www." + url;
    const http = "http://" + url;

    const order = [
        https_www, 
        http_www, 
        https, 
        http
    ];
    
    for(protocol of order) {
        const resp = await axios.head(protocol, {
              headers: headersConfig
        });        

        if(resp.status === 200) {
            return protocol;
        }    
    } 

    return http;
}

function isSameURL(url_1, url_2) {
    url_1 = url_1.replace("www.", "")
    url_2 = url_2.replace("www.", "")
    
    return url_1 === url_2;
}

module.exports = {
    getDomainFromURL,
    getExtension,
    createDirectory,
    getProperURL,
    isSameURL
}