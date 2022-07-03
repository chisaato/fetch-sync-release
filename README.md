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
