// file type group
const fileType = require("./groupByFileType")

// logo design group
const designType = require("./groupByDesign")

// company tags group
const companyType = require("./groupByCompany")

function groupQuestion(rl) {
    rl.question(`\nGroup files by:\n[1] File type\n[2] Color\n[3] Company tags\nOption: `, async (answer) => {
      
      switch (answer) {
        case "1":
          await fileType.group();
          groupQuestion(rl);
        break;
  
        case "2":
          designType.group();
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
