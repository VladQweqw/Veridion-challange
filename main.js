
// library for reading parquet files
const parquet = require('parquetjs-lite');

// library for reading console input from user
const readline = require("readline");

// library with secondary functions to keep main file clean
const f = require("./functions/functions")

// default configuration
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// read the parquet file
async function readParquet() {
  // open the parquet
  const reader = await parquet.ParquetReader.openFile('./data/logos.parquet');

  // cursor meaning where it starts to read
  const cursor = reader.getCursor();
  let record = null;
  
  // while there is data, we read it
  while (record = await cursor.next()) {
    // data stored as { domain: string }
    
    const final_domain = "http://www." + record.domain;

    // download each logo locally
    console.log(final_domain);
    await f.getLogoImagesFromURL(final_domain)
  }

  await reader.close();
}


// option chooser
function choose_option() {
  rl.question("[1] -> Fetch & download logos\n[2] -> Group logos\n> ", async (option) => {
    switch (option) {
      case "1":
        f.getLogoImagesFromURL("https://www.kia-moeller-wunstorf.de/");
        choose_option()
        break;

      case "2":
                
        break;
  
      default:
        console.log("\n!!! Invalid option, please choose again: ");
        choose_option()
        break;
      }  

  });
}


// start
console.log("=-=-=-= #1 Logo Similarity =-=-=-=");
choose_option();



