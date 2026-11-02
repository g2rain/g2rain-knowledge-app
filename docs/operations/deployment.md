# 构建与部署

## 本地前端构建

```bash
npm ci
npm run build
```

`npm run build` 执行 Vue/TypeScript 类型检查和 Vite 生产构建，产物为 `dist/`。它不运行单元测试、浏览器 E2E、容器联调或实际部署验证；本仓目前没有独立的测试脚本。

## 本地容器构建

本地构建与 CI 复用根目录 `Dockerfile`：Node 22 Alpine 构建静态资源，OpenResty Alpine 运行，入口为 `/docker-entrypoint.sh`。默认镜像地址为 `ghcr.io/g2rain/g2rain-knowledge-app`，运行时声明端口为 `8080`；入口实际默认 `SERVER_PORT=80`，因此生产部署应显式设为 `8080`。

```bash
./build.sh --tag 1.0.0 --build-mode production
# 等价：docker build --build-arg VITE_BUILD_MODE=production -t ghcr.io/g2rain/g2rain-knowledge-app:1.0.0 .
```

Dockerfile 将 `dist/`、Lua 签名代码、`lua/keys/README.md`、Nginx 模板和启动脚本复制至最终镜像；不会复制构建阶段的源码、`package.json`、`.env` 或 `.env.production`。`.env.production` 会作为 Vite 构建输入进入构建上下文，现有内容只有公开的路径与 `SSO_BASE_URL` 占位符，不得填入 Secret。`.dockerignore` 排除本地 `.env`、本地覆盖文件及 `lua/keys/` 的真实密钥；它不改变已跟踪文件在 Git 中的可见性。

## GHCR 发布

工作流为 `.github/workflows/image.yml`。它仅在推送稳定格式 `v<major>.<minor>.<patch>` 的 Git tag 时触发；普通分支推送、Pull Request 与手动触发均不会发布。工作流会：

1. 检查 tag 格式、tag 提交已进入 `origin/main` 历史，以及该提交中存在非空的 `docs/releases/v<版本>.md`。
2. 检查 tag 版本与 `package.json` 的 `version` 一致，然后执行 `npm ci` 与 `npm run build`。
3. 用 GitHub 提供的 `GITHUB_TOKEN` 登录 GHCR，并使用同一 Dockerfile 构建镜像。
4. 只有 `1.0.0` 与 `sha-<完整提交 SHA>` 两个标签都推送成功后，才写入 Actions Summary。

本工作流只构建和推送镜像：不创建 GitHub Release、不部署服务、也不更新 `latest`。权限仅声明 `contents: read` 与 `packages: write`，没有 PAT Secret。镜像带有 OCI `source`、`url`、`title`、`description`、`version`、`revision` 和 `licenses=Apache-2.0` 元数据。

分支流程是 `feature/* 或 fix/* → develop → 测试环境验证 → main`。先将发布改动和同名发布说明合入 `main`，再在已验证的 main 提交创建并推送 tag：

```bash
git tag v1.0.0
git push origin v1.0.0
```

首次成功推送后，若要允许匿名拉取，在 GitHub Packages 的包页面选择 **Package settings → Change visibility → Public**。若组织管理员禁止改动可见性，联系管理员。已有同名 GHCR 包还可能需要在 **Package settings → Actions access** 中授予 `g2rain/g2rain-knowledge-app` 写权限；出现 `denied` 时，优先检查该设置和组织 Packages 策略，而不是假定 `packages: write` 已足够。

匿名拉取仅在包已公开后可用：

```bash
docker pull ghcr.io/g2rain/g2rain-knowledge-app:1.0.0
```

## 运行与实际部署

```bash
docker run --rm -p 8080:8080 \
  -e SERVER_PORT=8080 \
  -e CONTEXT_PATH=/knowledge \
  -e GATEWAY_HOST=gateway \
  -e GATEWAY_PORT=8080 \
  -e IAM_HOST=iam \
  -e IAM_PORT=8080 \
  -e SSO_BASE_URL=https://platform.example.com \
  ghcr.io/g2rain/g2rain-knowledge-app:1.0.0
```

生产密钥必须通过 Kubernetes Secret、Docker Secret 或受控 Volume 挂载到 `/usr/local/openresty/nginx/lua/keys/`；不能在镜像、Vite 变量、仓库或日志中保存。运行时还应验证 `${CONTEXT_PATH}/api/`、`/auth/`、`/doc/` 代理、静态资源与 SPA 回退。在线演示、GHCR 推送和实际部署验收是相互独立的事实，均不能由本地构建替代。

## 回滚

使用不可变的版本标签或 `sha-<完整提交 SHA>` 回滚，并保留与该版本匹配的资源配置。不要使用或假定存在 `latest`；回滚前确认前端、IAM、Gateway、Basis 与知识服务兼容。
