const fs = require("fs");
const YAML = require("yaml");
const workflowComponent = require("./github-workflow");
const path = require("path");
let configArr = require("./github.json");

function buildConfig(config) {
  let releaseConfig = JSON.parse(JSON.stringify(config));
  delete releaseConfig.cron;
  let owner = releaseConfig.owner;
  let repo = releaseConfig.repo;
  // 默认值 3
  releaseConfig.count = releaseConfig.count || 3;
  // 不写就是默认值 false
  releaseConfig.prerelease = releaseConfig.prerelease || false;
  releaseConfig.source = releaseConfig.source || false;
  let filename = `gh-${owner}-${repo}.json`;
  fs.writeFileSync(
    `./generated-config/${filename}`,
    JSON.stringify(releaseConfig)
  );
}

function buildWorkflow(config) {
  let owner = config.owner;
  let repo = config.repo;
  let workflowJobName = `sync-gh-${owner}-${repo}`;
  let workflowFilename = `${workflowJobName}.json`;
  let configFilename = `gh-${owner}-${repo}.json`;
  let workflowMain = Object.assign({}, workflowComponent.workflow);
  // 填充 工作流配置
  workflowMain.name = `同步 gh-${owner}-${repo}`;
  workflowMain.on.schedule = config.schedule;
  workflowMain.on.push.paths = [
    // 首先是生成的配置文件
    path.join("generated-config", configFilename),
    // 然后 工作流文件
    path.join(".github", "workflows", `${workflowJobName}.yml`),
  ];
  // 填充 jobs 部分
  let workflowJob = Object.assign({}, workflowComponent.syncJob);
  // 修改参数 我们需要递归扫描
  workflowJob.steps.forEach((step) => {
    // 修改配置文件名称
    if (step.id === "gen-release-list") {
      // 说明找到了
      // console.log("找到了要修改的部分");
      step.run = `node src/github/github-fetch-release.js generated-config/${configFilename}`;
    }
    // 修改同步路径
    if (step.id === "sync-with-rclone") {
      // 说明找到了
      // console.log("找到了要修改的部分");
      step.run = `rclone sync -P --config rclone.conf --transfers 20 --retries 10 --s3-upload-concurrency 20 download/${owner}/${repo} \${RCLONE_REMOTE_PATH}/${owner}/${repo}`;
    }
  });
  // 将这个 job 写入到 workflow
  workflowMain.jobs = {};
  workflowMain.jobs[workflowJobName] = workflowJob;
  // 这里不要折叠
  YAML.scalarOptions.str.fold.lineWidth = 0;
  let workflowFileStr = YAML.stringify(workflowMain, {});
  // console.log(workflowMain);
  // console.log(workflowFileStr);
  fs.writeFileSync(
    path.join(".github", "workflows", `${workflowJobName}.yml`),
    workflowFileStr
  );
}

function buildGitHubConfig() {
  // 制作 GH Release
  configArr.forEach((config) => {
    buildConfig(config);
    buildWorkflow(config);
  });
}

module.exports = {
  buildGitHubConfig,
};
