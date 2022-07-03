# 抓取 GitHub 下载

可以抓 Release 下来 然后用于同步之类的

不会抓取以下内容

- i386/i686 等 32 位架构
- aarch64 以前的架构
- macOS (看心情)

只需要编辑一下 `fetch-repos.json`  
再运行

```bash
yarn build
```

提交之后等待 Actions 自动运行

## 配置要同步的内容

在 `src/github/github.json` 中可以配置要同步什么,以及要过滤什么. 一个典型配置如下

```json
{
	"owner": "TheAssassin",
	"repo": "AppImageLauncher",
	"count": 1,
	"include": [],
	"exclude": ["arm", "i386"],
	"schedule": [
		{
			"cron": "0 8 * * 1,3,5"
		}
	]
}
```

其中 `owner` 和 `repo` 我就不多说了. 而 `count` 决定了要同步几个最新的 release.

而过滤的顺序则是先进行关键字的 **包含** 匹配,再进行 **排除** 匹配.  
通过组合上面两个就可以很轻松筛选要什么内容.

最后是同步时间,这个用来产生不同的 Actions 文件. 参考 Actions 的 Cron 语法即可.

最后执行 `yarn build` 生成并格式化输出的 YAML 文件即可.

## 配置 rclone

向目标储存传输文件是通过 rclone 完成的. 看看 Actions 中有这么一段

```yaml
setps:
  - name: 生成 Rclone 远端配置
    run: echo "${RCLONE_REMOTE}" > rclone.conf
```

只需要把你的 rclone 配置文件写入名为 `RCLONE_REMOTE` 的 Secret 中即可. 请保留换行.

我知道对于 OneDrive 这种需要定期更新 Token 的会很麻烦. 但是这就留给各位思考了.
