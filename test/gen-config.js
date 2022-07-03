function buildConfig(config) {
  let releaseConfig = JSON.parse(JSON.stringify(config));
  delete releaseConfig.cron;
  let owner = releaseConfig.owner;
  let repo = releaseConfig.repo;
  let filename = `gh-${owner}-${repo}.json`;
  fs.writeFileSync(
    `./generated-config/${filename}`,
    JSON.stringify(releaseConfig)
  );
}

module.exports = {
  buildConfig: buildConfig,
};
