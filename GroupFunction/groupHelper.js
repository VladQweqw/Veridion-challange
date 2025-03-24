const fs = require("fs");
const path = require("path")

function makeSureFolderExists(dir_path, displayMessages = false){    
    try {
        if(!fs.existsSync(dir_path)) {
            fs.mkdirSync(dir_path)

            if(displayMessages) {
                console.log(`✅ Directory ${path.basename(dir_path)} created`);
            }
            
        }else {
            if(displayMessages) {
                console.log(`✅ Directory ${path.basename(dir_path)} already exists`);
            }
        }

        return true;
    }catch(err) {
        console.log(err);
        
        console.log("❌ Couldn't create directory");
        return false
    }
}

module.exports = {
    makeSureFolderExists
}