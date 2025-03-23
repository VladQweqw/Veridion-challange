
// library for reading parquet files
const parquet = require('parquetjs-lite');

// library for reading console input from user
const readline = require("readline");

// library with secondary functions to keep main file clean
const f = require("./functions/logo_scrapper")

const utils = require("./functions/utils")

// default configuration for reading console input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// array to store the failed website url, failed in the sense that the logo couldn't be fetched
const failed_array = [];

async function tryOrGetLogo(webiste_url, index) {
  console.log(`\n------- Website ${index} -------`);
  console.log(`Checking ${webiste_url}`);

  let resp;
  try {
    resp = await Promise.race([
      f.getLogoImagesFromURL(webiste_url),
      utils.timeoutPromise(),
    ])

    return resp
  } catch (error) {
    console.log(`${error}`);
  }

  console.log("---------------------");
  return false
}

// read the parquet file
async function readParquet(retry = false) {
  let index = 1;
  let total_success = 0;

  // if the user want to retry the fetch
  if (retry) {
    for (let website_url of failed_array) {
      const state = await tryOrGetLogo(website_url, index++)

      if (state) {
        total_success++;
      } else {
        // otherwise add it to failed array
        failed_array.push(final_domain)
      }

      return retry_failed_question()
    }
  }

  // open the parquet
  const reader = await parquet.ParquetReader.openFile('./data/logos.parquet');
  // cursor meaning where it starts to read
  const cursor = reader.getCursor();
  let record = null;

  // while there is data, we read it
  while (record = await cursor.next()) {
    // data stored as { domain: string }
    const final_domain = "https://www." + record.domain;

    if (index > 99) break;

    // call the function to get logos
    const state = await tryOrGetLogo(final_domain, index++)

    // if the logo was downloded succesfully count it
    if (state) {
      total_success++;
    } else {
      // otherwise add it to failed array
      failed_array.push(final_domain)
    }
  }

  // summary message
  console.log(`\n🚚 Summary: ${total_success}/${index} logos = ${Math.floor((total_success * 100) / index)}% success rate`);

  retry_failed_question()
  await reader.close();
}

// option chooser
function choose_option() {
  rl.question("\n[1] -> Fetch & download logos\n[2] -> Group logos\nOption: ", async (option) => {
    switch (option) {
      case "1":
        await readParquet()
        // await f.getLogoImagesFromURL('https://wurthsaudi.com/')
        // utils.getProperURL('https://www.ccusa.co.nz/')

        break;

      case "2":
        console.log("❌ Work in progress: ");
        choose_option()
        break;

      default:
        console.log("❌ Invalid option, please choose again: ");
        choose_option()
        break;
    }

  });
}

function retry_failed_question() {
  rl.question(`❓ ${failed_array.length} logo${failed_array.length > 1 ? "s" : ""} failed to be fetched, do you want to try again? y/n\n`,

    // make the answer lowercase for UX
    async (answer = answer.toLocaleLowerCase()) => {
      if (answer === "y") {
        await readParquet(true)
      } else if (answer === "n") {
        choose_option();
      } else {
        console.log("Invalid option, choose again");
        retry_failed_question();
      }
    }
  )
}

// start
console.log("=-=-=-= #1 Logo Similarity =-=-=-=");
choose_option();



