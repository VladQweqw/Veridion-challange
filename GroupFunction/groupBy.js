// imports
const path = require("path");
const fs = require("fs");
const getColors = require("get-image-colors")

// helper function
const helper = require("./groupHelper")
const constants = require("../utils/constants");


async function groupBy(cb, fileTypeDir) {
    // for summary purpose
    let fileCount = 0;
    let succesMoved = 0;

    // we make sure each folder exists, and the second parameter ( true ) means display messages
    helper.makeSureFolderExists(constants.GROUP__DIR_PATH, true); // create /groupped    
    helper.makeSureFolderExists(
        constants.GROUP__DIR_PATH + path.sep + fileTypeDir, true); // create /groupped/Design
    
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
                
                    // loop through each one
                    for(let file of files) {         
                        // create a loading message, that replace itself every loop, because of \r
                        process.stdout.write(`⌛ Loading ${Math.floor((fileCount * 100) / files.length)}%\r`)
                        // get the state of grouping process
                        const SUCCESS = await cb(file);
                        
                        // if we we're able to move the file, increment succes
                        if(SUCCESS) {
                            succesMoved++;
                        }
                        
                        // increment fileCount no matter what
                        fileCount++
                    }
                    // summary print + resolve(true)
                    console.log(`🚚 Summary: ${succesMoved}/${fileCount} logos groupped by ${fileTypeDir} (${Math.floor((succesMoved * 100) / fileCount)}%)`);
                    resolve(true)
                }
            })
        })

}

module.exports = {
    groupBy
}