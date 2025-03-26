// imports
const path = require("path");
const fs = require("fs");

// color getting libraries
const ColorThief = require('colorthief');

// helper function
const helper = require("./groupHelper")
const constants = require("../utils/constants");

async function group(file) {
    const fileTypeDir = constants.GROUP__DIR_PATH + path.sep + "Design"
    const image_location = constants.LOGO_DIR_PATH + path.sep + file;
    let flag = true;

    try {
        // return an array of 2 color palletes from the image
        rgb_palettes = await ColorThief.getPalette(image_location, 2)
        if(rgb_palettes.length <= 0) return false;
    } catch (err) {
        // if there was an error simply return false
        return false;
    }

    for (let palette of rgb_palettes) {
        const color = helper.convertColorCodeToWords(palette);
        if(!color) return false;
        
        // get and create info from file
        const save_location_dir = fileTypeDir + path.sep + `${color}` // save location directory, where the files will be saved /groupped/Red, blue , green etc
        const save_location_file = fileTypeDir + path.sep + color + path.sep + path.basename(file) // this is the /groupped/fileType
        const file_absolute_path = constants.LOGO_DIR_PATH + path.sep + file // the full absolute path of the saved file

        // we make sure the folder exists, ehre i don't want to print a message for each one, if there is an error display it but otherwise no
        const state = helper.makeSureFolderExists(save_location_dir);
        if (!state) {
            console.log(`❌ Couldn't create ${extension} directory`);
            return false
        }

        // save the response in a variable
        const SUCCESS = await new Promise((resolve, reject) => {
            // start copying the file
            // file_absolute_path current file location
            // save_location_file where it will be saved
            fs.copyFile(file_absolute_path, save_location_file, (err) => {
                if (!err) {
                    // no errors, good, return true ( Success )
                    resolve(true)
                } else {
                    // error, retrun false
                    reject(false)
                }
            });
        })

        if(!SUCCESS) {
            flag = false;
        }
    }

    return flag;
}

module.exports = {
    group
}