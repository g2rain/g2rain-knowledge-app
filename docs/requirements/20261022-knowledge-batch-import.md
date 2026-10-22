# 知识内容批量导入

状态：已实现（后端 + App）。FAQ CSV 与多文件同步导入；挂在 `knowledge_item` 资源上。

## 规则

| 规则 | 说明 |
|------|------|
| 已存在 key | 同组织 `knowledge_key` 已存在 → `SKIPPED` |
| 文件命名 | 文件名去掉扩展名 = `knowledge_key`；`knowledge_name` 同 stem |
| 规模 | 受 `spring.servlet.multipart.max-request-size` / `max-file-size` 约束（默认请求 20MB、单文件 10MB） |
| 导入后 | `submitReview=false` 留 `DRAFT`；`true` 则来源就绪后提交审核 → `REVIEWING` |
| key 格式 | `[a-z][a-z0-9_]*`，否则该条 `FAILED` |
| 版本号 | 批量新建固定 `revisionNo=v1` |

不自动审核通过、PROCESS 或发布。

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/knowledge_item/import/faq` | CSV 批量 FAQ |
| POST | `/knowledge_item/import/files` | 多文件批量 DOCUMENT |

App 经网关：`/knowledge/knowledge_item/import/*`。

### 入参（multipart）

| 字段 | 说明 |
|------|------|
| `file` / `files` | FAQ 用 `file`；文件导入用 `files` |
| `categoryId` | 可选 |
| `tags` | 可选，可重复；tag_code |
| `submitReview` | 可选，默认 false |

不传 `organId`（服务端上下文）。

FAQ CSV 列：`knowledge_key,knowledge_name,faq_question,faq_answer`，可选 `description`。

### 出参 `Result<KnowledgeImportResultVo>`

| 字段 | 说明 |
|------|------|
| `successCount` / `skippedCount` / `failedCount` | 汇总 |
| `items[].knowledgeKey` | 知识键 |
| `items[].itemStatus` | `SUCCESS` / `SKIPPED` / `FAILED` |
| `items[].knowledgeId` / `revisionId` | 成功时有 |
| `items[].errorCode` / `errorMessage` | 失败或跳过说明 |

整批拒绝（空文件）：`knowledge.40010`。上传超限由 servlet multipart 拦截。

## 分层

- `KnowledgeItemApi` / `KnowledgeItemController` / `KnowledgeItemService(Impl)`
- 内部调用 `KnowledgeDraftService`、`KnowledgeReviewService`
- 权限：`knowledge_item:import`
