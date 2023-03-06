# wysiwyg-editor

基于 tiptap 的所见即所得编辑器

## 开发

```shell
cd wysiwyg-editor

# 安装依赖
pnpm i

# 构建 packages
pnpm build

# 运行 demo 方便开发
pnpm demo
```

## 构建

## 发布

## 部署 pages

```shell
# 设置一次就行，使用 git worktree 将分支挂载为子目录：
git checkout -b demo-pages origin/demo-pages
git checkout master
git worktree add apps/demo/dist demo-pages

# 以后直接 构建部署
pnpm build:demo
pnpm pages
```
