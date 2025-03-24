// library for reading parquet files
const parquet = require('parquetjs-lite');

const f = require("./logoScrapper")
const helper = require("./helperFunctions");
const path = require("path")

// array to store the failed website url, failed in the sense that the logo couldn't be fetched
const failed_array = [];

async function CheckingWebsite(webiste_url, index) {
  console.log(`\n------- Website ${index} -------`);
  console.log(`Checking ${webiste_url}`);

  let resp;
  try {
    resp = await Promise.race([
      f.getWebsiteHTML(webiste_url),
      helper.timeoutPromise(),
    ])

    return resp
  } catch (error) {
    console.log(`${error}`);
  }

  console.log("---------------------");
  return false
}

function RetryFailedQuestion() {
  rl.question(`❓ ${failed_array.length} logo${failed_array.length > 1 ? "s" : ""} failed to be fetched, do you want to try again? y/n\n`,

    // make the answer lowercase for UX
    async (answer = answer.toLocaleLowerCase()) => {
      if (answer === "y") {
        await logoFunctions.readParquet(true)
      } else if (answer === "n") {
        choose_option();
      } else {
        console.log("Invalid option, choose again");
        retry_failed_question();
      }
    }
  )
}

// read the parquet file
async function readParquet(retry = false) {
  let index = 1;
  let total_success = 0;

  // if the user want to retry the fetch
  if (retry) {
    for (let website_url of failed_array) {
      const state = await CheckingWebsite(website_url, index++)

      if (state) {
        total_success++;
      } else {
        // otherwise add it to failed array
        failed_array.push(final_domain)
      }

      return RetryFailedQuestion();
    }
  }

  // open the parquet
  const parquet_path = path.join(__dirname, "../data/logos.parquet")
  const reader = await parquet.ParquetReader.openFile(parquet_path);
  
  // cursor meaning where it starts to read
  const cursor = reader.getCursor();
  let record = null;

  // while there is data, we read it
  while (record = await cursor.next()) {
    // data stored as { domain: string }
    const final_domain = "https://www." + record.domain;

    // set a limit for testing purpose
    // if (index > 99) break;

    // call the function to get logos
    const state = await CheckingWebsite(final_domain, index++)

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

  RetryFailedQuestion()
  await reader.close();
}

module.exports = {
    readParquet
}