
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


async function readParquet() {
  const reader = await parquet.ParquetReader.openFile('./data/logos.parquet');
  
  const cursor = reader.getCursor();
  let record = null;
  
  while (record = await cursor.next()) {
    console.log(record);
  }

  await reader.close();
}


// option chooser
function choose_option() {
  rl.question("[1] -> Fetch & download logos\n[2] -> Group logos\n> ", async (option) => {
    switch (option) {
      case "1":
        await f.getLogoImagesFromURL('https://www.toyotafocsani.ro/')
        choose_option()
        break;

      case "2":
        console.log(f.getDomainFromURL("https://www.toyotafocsani.ro/"));
        
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



