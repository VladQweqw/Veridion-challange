// library for reading console input from user
const readline = require("readline");

// library with secondary functions to keep main file clean
const groupFunctions = require("./GroupFunction/GroupUI")
const logoFunctions = require("./LogosFunctions/LogosUI")

// default configuration for reading console input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// option chooser
function start() {
  rl.question("\n[1] -> Fetch & download logos\n[2] -> Group logos\nOption: ", async (option) => {
    switch (option) {
      case "1":
        await logoFunctions.readParquet()
        // await f.getLogoImagesFromURL('https://wurthsaudi.com/')
        // utils.getProperURL('https://www.ccusa.co.nz/')
        break;

      case "2":
        groupFunctions.groupQuestion(rl);
        break;

      default:
        console.log("❌ Invalid option, please choose again: ");
        choose_option()
        break;
    }

  });
}

// start
console.log("=-=-=-= #1 Logo Similarity =-=-=-=");
start();



