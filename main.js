
// library for reading parquet files
const parquet = require('parquetjs-lite');

// library for reading console input from user
const readline = require("readline");

// library with secondary functions to keep main file clean
const f = require("./functions/logo_scrapper")

// default configuration
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// read the parquet file
async function readParquet() {
  let index = 1;
  let total_success = 0;
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
    console.log(`\n------- Website ${index++} -------`);
    console.log(`Checking ${final_domain}`);
    const resp = await f.getLogoImagesFromURL(final_domain)
    if(resp) {
      total_success++;
    }
    console.log("---------------------");
  }

  console.log(`🚚 Summary: ${total_success}/${index} logos = ${Math.floor((total_success * 100) / index)}% success rate`);

  choose_option()
  await reader.close();
}

// option chooser
function choose_option() {
  rl.question("\n[1] -> Fetch & download logos\n[2] -> Group logos\nOption: ", async (option) => {    
    switch (option) {
      case "1":
        // readParquet()
        f.getLogoImagesFromURL('https://vladpoienariu.netlify.app/')
        
        break;

      case "2":
                
        break;
  
      default:
        console.log("!!! Invalid option, please choose again: ");
        choose_option()
        break;
      }  

  });
}


// start
console.log("=-=-=-= #1 Logo Similarity =-=-=-=");
choose_option();



