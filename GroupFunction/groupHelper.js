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

    if(saturation <= 10) {
        if(lightness > 90) return "White"
        if(lightness < 10) return "Black"
        return "Gray"
    }

    const match = colors.find((color) => {
        const min = color.threshold.min;
        const max = color.threshold.max;

        if(hue >= min && hue <= max) {
            return color;
        }
    })

    return match?.color || null;
}

// exports
module.exports = {
    makeSureFolderExists,
    convertColorCodeToWords
}