# 贡献

## 开发

```shell
git clone https://gitee.com/oschina/tide.git

cd tide

# 安装依赖
pnpm i

# 构建 packages
pnpm build

# 运行 demo 方便开发
pnpm dev:demo
```

## 部署 pages

以下脚本执行一次就行，使用 git worktree 将 Pages 部署分支挂载为子目录：

```shell
git checkout -b demo-pages origin/demo-pages
git checkout master
git worktree add apps/demo/dist demo-pages
```

## 构建并发布

```shell
pnpm build:app_demo
pnpm pages
```
