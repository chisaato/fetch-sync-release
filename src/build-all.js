const fs = require("fs");
const path = require("path");
// 确保配置和下载目录存在
fs.mkdirSync(path.join(".github", "workflows"), { recursive: true });
fs.mkdirSync(path.join("generated-config"), { recursive: true });
// 制作 GitHub
require("./github/github-build-config").buildGitHubConfig();
