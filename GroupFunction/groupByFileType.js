let files_len = 0;

const path = require("path");

const helper = require("./groupHelper")
const constants = require("../utils/constants");

const fileTypeDir = constants.GROUP__DIR_PATH + path.sep + "fileType"

const fs = require("fs");
async function group() {
    helper.makeSureFolderExists(constants.GROUP__DIR_PATH, true); // create /groupped
    helper.makeSureFolderExists(fileTypeDir, true); // create /groupped/fileType

    let fileCount = 0;
    let succesMoved = 0;

    await new Promise((resolve, reject) => {
        fs.readdir(
            constants.LOGO_DIR_PATH, 
            async (err, files) => {
            if(err) {
                console.log("❌ Error when trying to read files"); 
                reject(true)           
            }else {
                console.log(`✅ Found ${files.length} files`);
                
                for(let file of files) {
                    const extension = path.extname(file).toLocaleLowerCase();
                    const save_location_dir = fileTypeDir + path.sep + `${extension}`
                    const save_location_file = fileTypeDir + path.sep + extension + path.sep + path.basename(file)
                    const file_absolute_path = constants.LOGO_DIR_PATH + path.sep + file
    
                    const state = helper.makeSureFolderExists(save_location_dir);
                    if(!state) {
                        console.log(`|-> ❌ Couldn't create ${extension} directory`);
                    }
                                    
                    const SUCCESS = await new Promise((resolve, reject) => {
                        fs.copyFile(file_absolute_path, save_location_file, (err) => {
                            if(!err) {
                                resolve(true)
                            }else {
                                reject(true)
                            }
                        });
                    })
                    
                    if(SUCCESS) {
                        succesMoved++;
                    }
                    fileCount++
                }
                console.log(`|-> ✅ ${succesMoved}/${fileCount} logos groupped`);
                resolve(true)
            }
        })
    })
}


module.exports = {
    group
}