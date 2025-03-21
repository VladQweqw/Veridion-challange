const fs = require("fs");

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

function createDirectory(path) {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            console.log("✅ Directory created");
        } else {
            console.log("✅ Directory already exists");
        }
    } catch (err) {
        console.log(`❌ ${err}`);
    }
}

module.exports = {
    getDomainFromURL,
    getExtension,
    createDirectory
}