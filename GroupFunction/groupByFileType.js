// imports
const path = require("path");
const fs = require("fs");

// helper function
const helper = require("./groupHelper")
const constants = require("../utils/constants");

// this is tghe directory of only this groupting type
const fileTypeDir = constants.GROUP__DIR_PATH + path.sep + "fileType"

async function group() {
    // we make sure each folder exists, and the second parameter ( true ) means display messages
    helper.makeSureFolderExists(constants.GROUP__DIR_PATH, true); // create /groupped
    helper.makeSureFolderExists(fileTypeDir, true); // create /groupped/fileType

    // for summary purpose
    let fileCount = 0;
    let succesMoved = 0;

    // create a promise to return things in order
    await new Promise((resolve, reject) => {
        // start reading the files
        fs.readdir(
            constants.LOGO_DIR_PATH, // logo directory path
            async (err, files) => {
            if(err) {
                // if there was an error, reject(true)
                console.log("❌ Error when trying to read files"); 
                reject(true)           
            }else {
                // count the files found
                console.log(`✅ Found ${files.length} files`);
                
                // lopp through each one
                for(let file of files) {
                    // get and create info from file
                    const extension = path.extname(file).toLocaleLowerCase(); // extension from the file like .png etc
                    const save_location_dir = fileTypeDir + path.sep + `${extension}` // save location directory, where the files will be saved /groupped
                    const save_location_file = fileTypeDir + path.sep + extension + path.sep + path.basename(file) // this is the /groupped/fileType
                    const file_absolute_path = constants.LOGO_DIR_PATH + path.sep + file // the full absolute path of the saved file
                    
                    // we make sure the folder exists, ehre i don't want to print a message for each one, if there is an error display it but otherwise no
                    const state = helper.makeSureFolderExists(save_location_dir);
                    if(!state) {
                        console.log(`❌ Couldn't create ${extension} directory`);
                    }
                    
                    // save the response in a variable
                    const SUCCESS = await new Promise((resolve, reject) => {
                        // start copying the file
                        // file_absolute_path current file location
                        // save_location_file where it will be saved
                        fs.copyFile(file_absolute_path, save_location_file, (err) => {
                            if(!err) {
                                // no errors, good, return true ( Success )
                                resolve(true)
                            }else {
                                // error, retrun false
                                reject(false)
                            }
                        });
                    })
                    
                    // if we we're able to move the file, increment succes
                    if(SUCCESS) {
                        succesMoved++;
                    }

                    // increment fileCount no matter what
                    fileCount++
                }
                // summary print + resolve(true)
                console.log(`🚚 Summary: ${succesMoved}/${fileCount} logos groupped by file type (${Math.floor((succesMoved * 100) / fileCount)}%)`);
                resolve(true)
            }
        })
    })
}


module.exports = {
    group
}