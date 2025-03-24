// axios headers config to prevent 403 Fobridden erros
const headersConfig = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

// default image saving location
const path = require("path");

const LOGO_DIR_NAME = '../logos/';
const GROUP__DIR_PATH = path.join(__dirname, "..", "groupped")
const LOGO_DIR_PATH = path.join(__dirname, "..", "logos")

module.exports = {
    headersConfig,
    LOGO_DIR_NAME,
    LOGO_DIR_PATH,
    GROUP__DIR_PATH
}