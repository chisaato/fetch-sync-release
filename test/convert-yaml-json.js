const yaml = require("yaml");
const fs = require("fs");
let yamlConfig = yaml.parse(fs.readFileSync("./test/workflow.yml").toString());
console.log(yamlConfig);
console.log(JSON.stringify(yamlConfig));
