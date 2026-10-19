<p align="center">
  <img src="https://github.com/g2rain.png" alt="谷雨 G2rain" width="120" />
</p>

# g2rain-knowledge-app · 知识库运营应用

谷雨 G2rain 开源 AI Native SaaS 平台的知识库运营前端，将知识内容、版本、审核、处理、发布和效果验证组织为运营流程。

[平台总入口](https://github.com/g2rain/g2rain) · [配套知识服务](https://github.com/g2rain/g2rain-knowledge) · [完整文档](docs/index.md) · [v1.0.0 发布说明](docs/releases/v1.0.0.md) · [Issues](https://github.com/g2rain/g2rain-knowledge-app/issues)

## 当前版本

**v1.0.0 稳定版**，配套 `g2rain-knowledge v1.0.0`。维护者确认服务器端验证通过；本地类型检查与生产构建通过。已知限制与环境边界见[发布说明](docs/releases/v1.0.0.md)。

本项目是知识库业务 App，继承官方前端模板的工程能力；前端创建工具为 [g2rain-app-cli](https://github.com/g2rain/g2rain-app-cli)，模板源为 [g2rain-app-template](https://github.com/g2rain/g2rain-app-template)。本项目不作为 CLI 发布时嵌入的模板源。

## 运营入口

| 入口 | 内容 |
| --- | --- |
| 知识内容 | 维护文档 / FAQ 主题，在抽屉中管理版本与相关信息 |
| 内容审核 | 提交、通过或拒绝审核，结合受控原文下载核对内容 |
| 知识处理 | 查看处理任务，按状态执行后端支持的重试或取消操作 |
| 发布管理 | 发布与回滚选择，查看当前线上内容 |
| 效果验证 | 问答与检索验证，查看结果和引用 |
| 知识设置 | 分类、标签与回复模板 |

页面操作以真实后端状态与接口为准，不通过前端伪造发布、任务或索引状态。历史版本与切片入口保留兼容映射，主要操作入口在知识内容中。

## 快速开始

前置条件：Node.js 22+、npm，以及可用的 IAM、Gateway、Basis 资源配置和知识服务。独立运行仍依赖这些服务。

```bash
git clone https://github.com/g2rain/g2rain-knowledge-app.git
cd g2rain-knowledge-app
git checkout v1.0.0
npm ci
npm run build
```

按[配置说明](docs/operations/configuration.md)配置本地环境，通过 `.env.local` 覆盖环境值，勿提交真实凭据。PowerShell 启动示例：

```powershell
$env:VITE_RUN_MODE = 'alone'
$env:VITE_SERVER_PORT = '3001'
npm run dev
```

也可在开发地址追加 `?mode=alone`。默认空模式表示集成意图，未挂载时跳转到主壳入口；这与独立 SSO 模式不同。

## 与平台集成

- `applicationCode`、Context Path、应用资源和 IAM 回调须与平台配置对应。
- 集成挂载要求 `applicationCode`、`viewId`、`instanceId`；迁移期 `appKey === instanceId`。
- Token 通过 Auth Bridge 定向消息传递，不通过公开 props 注入。
- 前端页面与按钮控制展示，Gateway 与知识服务执行接口准入与租户隔离。
- `npm run build:config` 用于资源配置生成；当前不生成完整 API endpoint 清单，变更须 Review 并按平台资源规则导入。

详见[运行时流程](docs/architecture/runtime-flows.md)、[安全边界](docs/security/security-boundaries.md)和[架构差异](docs/architecture/deviations.md)。

## 构建与部署

```bash
npm run build
```

产物为 `dist/`，部署方式与运行变量见[构建与部署](docs/operations/deployment.md)。部署需匹配 `/knowledge/` 路径与平台代理；容器显式设置 `SERVER_PORT=8080`。

页面生成与资源生成是开发工具能力，不在发布前覆盖真实业务页面。命令与覆盖风险见[代码生成](docs/development/code-generation.md)和[资源生成](docs/development/resource-generation.md)。

## 文档与贡献

- [架构与目录职责](docs/architecture/overview.md)
- [开发与测试](docs/development/testing.md)
- [发布记录与已知限制](docs/releases/README.md)
- [社区与贡献](docs/community.md)
- [Agent 执行约束](AGENTS.md)

项目保留 `frontend-app 1.0.0-draft` 的架构试点声明；应用版本发布不自动升级中央基线。构建可出现包体积、MockJS 与运行配置脚本等警告，状态见架构差异。

## 联系与许可证

[g2rain_developer@163.com](mailto:g2rain_developer@163.com) · [组织交流](https://github.com/g2rain/g2rain/discussions)

本项目采用 [Apache License 2.0](LICENSE)。欢迎 Star [G2rain 主仓库](https://github.com/g2rain/g2rain)关注平台方向。
