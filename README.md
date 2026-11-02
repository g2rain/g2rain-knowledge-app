<p align="center">
  <img src="https://github.com/g2rain.png" alt="G2rain（谷雨）开源智能体平台" width="120" />
</p>

# g2rain-knowledge-app · 知识库运营应用

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-339933?logo=node.js&logoColor=white)](package.json)
[![Vue](https://img.shields.io/badge/Vue-3.5-42B883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

G2rain（谷雨）开源智能体平台中的知识库运营前端。它把知识内容、版本、审核、处理、发布和检索/问答效果验证组织为可操作的流程；身份认证、接口准入、租户隔离、知识处理和模型能力由平台的 IAM、Gateway 与后端服务负责。

[官网](https://www.g2rain.com) · [平台总入口](https://github.com/g2rain/g2rain) · [配套知识服务](https://github.com/g2rain/g2rain-knowledge) · [完整文档](docs/index.md) · [v1.0.0 发布说明](docs/releases/v1.0.0.md) · [Issues](https://github.com/g2rain/g2rain-knowledge-app/issues)

## 当前状态

**v1.0.0 稳定版**，与 `g2rain-knowledge v1.0.0` 配套。现有知识库运营能力可在企业环境私有部署；独立运行仍依赖 IAM、Gateway、Basis 资源和知识服务，不是离线 Demo。

维护者已记录服务器端验证通过，本地 `npm run build` 通过。构建、镜像发布、在线演示和实际部署验收是不同的验证范围；已知限制见[发布说明](docs/releases/v1.0.0.md)。

## 能力边界

| 运营入口 | 已交付的前端职责 |
| --- | --- |
| 知识内容 | 维护文档 / FAQ 主题，在抽屉中管理版本与相关信息 |
| 内容审核 | 提交、通过或拒绝审核，并结合受控原文下载核对内容 |
| 知识处理 | 查看处理任务，并按后端支持范围重试或取消 |
| 发布管理 | 选择发布或回滚，查看当前线上内容 |
| 效果验证 | 发起问答 / 检索验证，查看结果与引用 |
| 知识设置 | 管理分类、标签与回复模板 |

页面展示不伪造发布、任务或索引状态。前端资源控制展示，Gateway 与知识服务才负责真实接口授权、租户隔离和业务状态；原文下载采用专用认证直出客户端，失败时不会保存空响应。

## 快速开始

### 前置条件

- Node.js `>=22`
- npm
- 可用的 IAM、Gateway、Basis 与知识服务配置

```bash
git clone https://github.com/g2rain/g2rain-knowledge-app.git
cd g2rain-knowledge-app
git checkout v1.0.0
npm ci
npm run build
```

开发时使用 `.env.local` 覆盖本地环境值，切勿提交凭据。PowerShell 独立运行示例：

```powershell
$env:VITE_RUN_MODE = 'alone'
$env:VITE_SERVER_PORT = '3001'
npm run dev
```

也可在开发地址追加 `?mode=alone`。空运行模式表示集成意图；未挂载时会回到主壳入口，与独立 SSO 模式不同。变量、Context Path 与回调配置见[配置说明](docs/operations/configuration.md)。

## 集成约定

- `applicationCode`、Context Path、应用资源和 IAM 回调必须与平台配置一致。
- 集成挂载需要 `applicationCode`、`viewId`、`instanceId`；迁移期 `appKey === instanceId`。
- Token 经 Auth Bridge 定向传递，不通过公开 props 注入。
- `npm run build:config` 用于生成资源配置；它不生成完整 API endpoint 清单，生成后必须 Review 并按平台规则导入。

更多细节见[运行时流程](docs/architecture/runtime-flows.md)、[安全边界](docs/security/security-boundaries.md)和[架构差异](docs/architecture/deviations.md)。

## 构建、容器与 GHCR

`npm run build` 生成 `dist/`。本地容器构建与 CI 使用同一个根目录 Dockerfile：Node 22 Alpine 构建，OpenResty Alpine 运行，入口为 `/docker-entrypoint.sh`。镜像声明端口为 `8080`，实际部署请显式设置 `SERVER_PORT=8080`。

```bash
./build.sh --tag 1.0.0 --build-mode production
docker pull ghcr.io/g2rain/g2rain-knowledge-app:1.0.0
```

稳定版镜像地址为 `ghcr.io/g2rain/g2rain-knowledge-app`。只有推送精确格式 `v<major>.<minor>.<patch>`、其提交已进入 `main` 且包含同名发布说明的 tag 才会触发 GHCR 发布。成功时推送 `1.0.0` 与 `sha-<完整提交 SHA>`；不创建 GitHub Release、不部署服务、也不更新 `latest`。

首次成功推送后，如需匿名拉取，请在 GitHub Packages 的 **Package settings → Change visibility → Public** 设置公开。若推送被拒绝，先检查该包的 **Actions access** 与组织 Packages 策略。完整的发布顺序、权限、镜像内容、密钥注入和回滚步骤见[构建与部署](docs/operations/deployment.md)。

## 开发与文档

本应用继承 [g2rain-app-template](https://github.com/g2rain/g2rain-app-template) 的工程能力，由 [g2rain-app-cli](https://github.com/g2rain/g2rain-app-cli) 创建；它不是 CLI 内嵌模板源。

- [架构与目录职责](docs/architecture/overview.md)
- [开发与测试边界](docs/development/testing.md)
- [代码与资源生成](docs/development/code-generation.md)
- [发布记录与已知限制](docs/releases/README.md)
- [社区与贡献](docs/community.md)
- [维护约束](AGENTS.md)

项目仍记录 `frontend-app 1.0.0-draft` 架构试点状态；应用软件版本不自动提升中央架构基线。

## 许可证与联系

本项目采用 [Apache License 2.0](LICENSE)。欢迎通过 [Issues](https://github.com/g2rain/g2rain-knowledge-app/issues)、[Discussions](https://github.com/g2rain/g2rain/discussions) 或 [g2rain_developer@163.com](mailto:g2rain_developer@163.com) 交流。
