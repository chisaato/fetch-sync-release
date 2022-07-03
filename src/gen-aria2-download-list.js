const fs = require("fs");

const path = require("path");
const args = process.argv.slice(2);
let filename = args[0];
let downloadConfig = require(path.join(process.cwd(), filename));
let fileContent = "";
downloadConfig.forEach((ver) => {
  // console.log(ver);
  // 下载目录列表
  // download/{owner}/{repo}/{version}
  let downloadPath = path.join("download", ver.owner, ver.repo, ver.version);
  fs.mkdirSync(downloadPath, { recursive: true });
  // 生成下载文件的列表
  ver.files.forEach((url) => {
    let downloadItem = `${url}
            dir=${downloadPath}`;
    // console.log(downloadItem);
    fileContent += downloadItem;
    fileContent += "\n";
    // console.log(fileContent);
  });
  // 这里咱们补充一个换行
  // fileContent += "\n";
  // 源码的下载是可选的
  if (ver.src) {
    let srcItem = `${ver.src.zip}
            dir=${downloadPath}
            out=source.zip
${ver.src.tar}
            dir=${downloadPath}
            out=source.tar`;
    fileContent += srcItem;
  }
  fileContent += "\n";
  // console.log(fileContent);
});
// console.log(fileContent);
fs.writeFileSync("aria2-list.txt", fileContent);
