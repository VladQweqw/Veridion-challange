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

// credite: https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/
// I did not made this function
const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
};

// function to convert from RGB 123, 213,312 to a color name like Red, blue, green
function convertColorCodeToWords(rgb_pallete) {
    // a color pallete looks like [12,421,421] -> RGB format
    // convert RGB palette to HSL ( easier )
    const pallete_hsl = rgbToHsl(
        rgb_pallete[0], 
        rgb_pallete[1], 
        rgb_pallete[2]
    );

    // get the H, S, L values of the palette    
    const hue = pallete_hsl[0];
    const saturation = pallete_hsl[1];
    const lightness = pallete_hsl[2];

    // the color wheel colors ROGVAIV
    // return colors
    // threshold is a range of values for the hue, if a colors is between that range it means it that color +-, based on my eyes. this is very accurate but does a pretty good job overall
    const colors = [
        {
            threshold: {
                min: 0,
                max: 16,
            },
            color: "Red"
        },
        {
            threshold: {
                min: 17,
                max: 38,
            },
            color: "Orange"
        },
        {
            threshold: {
                min: 39,
                max: 60,
            },
            color: "Orange"
        },
        {
            threshold: {
                min: 61,
                max: 158,
            },
            color: "Green"
        },
        {
            threshold: {
                min: 159,
                max: 256,
            },
            color: "Blue"
        },
        {
            threshold: {
                min: 257,
                max: 280,
            },
            color: "Purple"
        },
        {
            threshold: {
                min: 281,
                max: 290,
            },
            color: "Pink"
        },
        {
            threshold: {
                min: 291,
                max: 320,
            },
            color: "Magenta"
        },
        {
            threshold: {
                min: 292,
                max: 360,
            },
            color: "Red"
        },
    ]
    
    // if the lightness is very low, the color should be black
    if(lightness <= 15) return "Black"
    // if the saturation is low nad hue is low as ewll, meaning is on the top right corner of the color pciker, and the lightness is very high it means it s a white
    if(hue < 15 && saturation < 15 && lightness > 75) return "White" 

    // if the color is less saturate we can checl om which part the lightness go, if it's high its white and vice versa
    // if it's in between it's gray
    if(saturation <= 15) {
        if(lightness > 90) return "White"
        if(lightness < 10) return "Black"
        return "Gray"
    }

    // build in find method to retreive the color that is between the threshold
    const match = colors.find((color) => {
        const min = color.threshold.min;
        const max = color.threshold.max;

        if(hue >= min && hue <= max) {
            return color;
        }
    })

    // return the match.color or null
    return match?.color || null;
}

// exports
module.exports = {
    makeSureFolderExists,
    convertColorCodeToWords
}