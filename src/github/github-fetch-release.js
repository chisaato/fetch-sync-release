const { Octokit } = require("octokit");
const path = require("path");
const fs = require("fs");
const octokit = new Octokit();

// 加载配置文件
const args = process.argv.slice(2);
let filename = args[0];
let repoConfig = require(path.join(process.cwd(), filename));
let owner = repoConfig.owner;
let repo = repoConfig.repo;
let fetchCount = repoConfig.count;
let fetchPreRelease = repoConfig.prerelease;
let fetchSource = repoConfig.source;
let includeList = repoConfig.include;
let excludeList = repoConfig.exclude;
// 构造请求
const releaseInfo = octokit.request("GET /repos/{owner}/{repo}/releases", {
  owner: owner,
  repo: repo,
});

function matchList(url) {
  // 当包括列表开启了`
  if (includeList.length > 0) {
    let containInInclude = includeList.some((keyword) => {
      return url.includes(keyword);
    });
    if (!containInInclude) {
      // 不包含,直接 false
      return false;
    }
  }
  // 当排除列表开启了
  if (excludeList.length > 0) {
    let containInExclude = excludeList.some((keyword) => {
      return url.includes(keyword);
    });
    if (containInExclude) {
      return false;
    }
  }
  return true;
}

function parseRelease(release) {
  let assets = release.assets;
  let urlArr = [];
  assets.forEach((asset) => {
    // 先匹配 include
    let downloadUrl = asset.browser_download_url;
    if (matchList(downloadUrl)) {
      urlArr.push(downloadUrl);
    }
  });

  return urlArr;
}

releaseInfo
  .then((result) => {
    // console.log(result);
    let downloadList = [];
    let indexOfReleases = 0;
    for (let i = 0; i < fetchCount; ) {
      // 还要看看对方剩下多少个,不够了可不能取
      // 对方能取的 = 0 就不能再取了
      if (result.data.length - indexOfReleases === 0) {
        break;
      }
      let release = result.data[indexOfReleases];
      let preRelease = release.prerelease;
      // 如果他是一个 PreRelease 判断一下我要不要他
      if (preRelease && !fetchPreRelease) {
        // 但是我不要的话 fetchPreRelease 为 false
        // 这里我要让他执行这一段,所以要反转条件
        // 这里我们不懈逻辑,写一个跳过就可以了
        // 但是游标必须下移
        indexOfReleases++;
        continue;
      }
      // 跳过 PreRelease 后面的我都要
      let fetchConfig = {
        owner: owner,
        repo: repo,
        version: release.tag_name,
        files: parseRelease(release),
      };
      if (fetchSource) {
        // 看看要不要包括源码
        fetchConfig.src = {
          tar: release.tarball_url,
          zip: release.zipball_url,
        };
      }
      downloadList.push(fetchConfig);
      i++;
      indexOfReleases++;
    }
    return downloadList;
  })
  .then((downloadList) => {
    // console.log(downloadList);
    // 写入文件
    let targetFilename = path.join(process.cwd(), "filtered-assets.json");
    fs.writeFileSync(targetFilename, JSON.stringify(downloadList));
  });
