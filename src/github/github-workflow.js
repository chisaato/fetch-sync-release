const githubWorkflow = {
  name: "同步 XXX",
  on: {
    push: {
      paths: [
        // "generated-config/xxx",
        // ".github/workflows/xxx.yml",
        // "src/github.json",
      ],
    },
    schedule: [{ cron: "30 4 * * 3" }],
  },
  env: {
    RCLONE_REMOTE: "${{ secrets.RCLONE_REMOTE }}",
    RCLONE_REMOTE_PATH: "${{ secrets.RCLONE_REMOTE_PATH }}",
  },
  jobs: {
    // "sync-xxx":
    // 在这里填写名字
  },
};
const syncJob = {
  container: "node:alpine",
  "runs-on": "ubuntu-latest",
  steps: [
    { name: "检出代码", uses: "actions/checkout@v2" },
    {
      name: "安装软件包",
      run: "apk add --no-cache bash ca-certificates curl wget aria2 rclone",
    },
    { name: "安装 NodeJS 依赖", run: "yarn" },
    {
      name: "生成要拉取的 Release 清单",
      id: "gen-release-list",
      // 在这里需要修改
      run: "",
    },
    {
      name: "生成 Aria2 下载列表",
      run: "node src/gen-aria2-download-list.js filtered-assets.json",
    },
    {
      name: "调用 Aria2 下载",
      run: "aria2c -x 16 -c -j 10 -s 10 -i aria2-list.txt",
    },
    {
      name: "生成 Rclone 远端配置",
      run: 'echo "${RCLONE_REMOTE}" > rclone.conf',
    },
    {
      name: "调用 Rclone 同步",
      id: "sync-with-rclone",
      run: "rclone copy -P --config rclone.conf --transfers 20 --retries 10 --s3-upload-concurrency 20 download/ ${RCLONE_REMOTE_PATH}/",
    },
  ],
};
module.exports = {
  workflow: githubWorkflow,
  syncJob,
};
