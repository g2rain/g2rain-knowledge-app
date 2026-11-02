# 发布记录

- [v1.0.0：知识库首个稳定版](v1.0.0.md)

源代码通过 `feature/* → develop → main` 的 PR 流程集成。合入 main 后，在已验证的 main 提交创建 `v<major>.<minor>.<patch>` 标签；发布工作流校验标签属于 main、存在同名发布说明与项目版本一致后，构建并推送 GHCR 镜像。

发布说明区分维护者的服务器验证、本地构建和已知限制。稳定标签推送只发布 GHCR 镜像，不创建 GitHub Release、不部署服务、也不更新 `latest`；其他制品渠道另按其凭证与流程执行。
