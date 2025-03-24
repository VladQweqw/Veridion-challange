function groupQuestion() {
    rl.question(`\nGroup files by:\n[1] File type\n[2] Color\n[3] Company tags\nOption: `, (answer) => {
  
      switch (answer) {
        case "1":
  
        break;
  
        case "2":
          
        break;
  
        case "3":
          
        break;
  
        default:
          console.log("❌ Invalid option, please choose again: ");
          groupLogos()
          break;
      }
      
     
    })
}


module.exports = {
    groupQuestion,
}
