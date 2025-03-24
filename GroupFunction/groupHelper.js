// imports
const fs = require("fs");
const path = require("path")

// dir path is the direcotry path we want to check, displayMessage is a variable that in case it's true it will display the status message, by default it's false ( off )
function makeSureFolderExists(dir_path, displayMessages = false){    
    try {
        if(!fs.existsSync(dir_path)) {
            // if the directory doesn't exists, create it
            fs.mkdirSync(dir_path)

            // condifitonally dispaly message
            if(displayMessages) {
                console.log(`✅ Directory ${path.basename(dir_path)} created`);
            }
            
        }else {
            // condifitonally dispaly message
            // if the directory is already there 
            if(displayMessages) {
                console.log(`✅ Directory ${path.basename(dir_path)} already exists`);
            }
        }

        // return true if there is a directory or was created
        return true;
    }catch(err) {        
        if(displayMessages) {
            console.log("❌ Couldn't create directory");
        }
        // if the directory couldn't be created
        return false
    }
}

// exports
module.exports = {
    makeSureFolderExists
}