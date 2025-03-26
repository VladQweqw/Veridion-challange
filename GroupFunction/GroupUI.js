// different groupping types imports
const fileType = require("./groupByFileType")
const designType = require("./groupByDesign")

// group by import, the wrapper function
const { groupBy } = require("./groupBy");

const groupHelper = require("./groupHelper")

// company tags group
const companyType = require("./groupByCompany")

function groupQuestion(rl) {
    rl.question(`\nGroup files by:\n[1] File type\n[2] Color\n[3] Company tags\nOption: `, async (answer) => {
      
      switch (answer) {
        case "1":
          await groupBy(fileType.group, "FileType");
          groupQuestion(rl);
        break;
  
        case "2":
          await groupBy(designType.group, "Design");
          groupQuestion(rl);
        break;
  
        case "3":
          companyType.group();
          groupQuestion(rl);
        break;
  
        default:
          console.log("❌ Invalid option, please choose again: ");
          break;
      }
    })
}


module.exports = {
    groupQuestion,
}
