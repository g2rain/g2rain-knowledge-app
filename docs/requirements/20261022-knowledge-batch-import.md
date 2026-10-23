# 知识内容批量导入

状态：已实现（后端 + App）。主题 CSV → 文件挂接两步导入；FAQ 单步 CSV；挂在 `knowledge_item` 资源上。标签与优先级归属主题（Item）。

## 规则

| 规则 | 说明 |
|------|------|
| 主题 CSV | 创建 DOCUMENT 主题 + 空 FILE 草稿；写入分类/标签/优先级；已存在 key → `SKIPPED`；**不** submitReview |
| 文件挂接 | 文件名去掉扩展名 = `knowledge_key`；主题不存在 → `FAILED`（`knowledge.40011`）；挂接到已有 FILE 草稿（无则新建） |
| FAQ CSV | 一行一 FAQ 主题+草稿；标签/优先级写 Item；已存在 key → `SKIPPED` |
| 规模 | 受 `spring.servlet.multipart.max-request-size` / `max-file-size` 约束 |
| 导入后 | FAQ/文件：`submitReview=false` 留 `DRAFT`；`true` 则来源就绪后提交审核 |
| key 格式 | `[a-z][a-z0-9_]*`，否则该条 `FAILED` |
| 版本号 | 无草稿时自动分配下一 `vN`（已有 `v1` 则 `v2`…）；非 `vN` 风格时用毫秒时间戳 |
| 文件内容去重 | 上传前计算 SHA-256，仅与同主题**最新** FILE 版本的 `source_sha256` 相同则 `SKIPPED`；历史版本相同仍可上传（允许回退） |

不自动审核通过、PROCESS 或发布。已发布主题改标签后需重新 PROCESS 才会更新 Milvus。

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/knowledge_item/import/items` | 主题 CSV（DOCUMENT + 空 FILE 草稿） |
| POST | `/knowledge_item/import/files` | 多文件挂接到已有主题 |
| POST | `/knowledge_item/import/faq` | CSV 批量 FAQ |

App 经网关：`/knowledge/knowledge_item/import/*`。

### 入参（multipart）

| 字段 | 说明 |
|------|------|
| `file` / `files` | items/FAQ 用 `file`；文件挂接用 `files` |
| `categoryId` | 可选（主题 CSV / FAQ） |
| `tags` | 可选，可重复；写入主题（文件挂接忽略） |
| `priority` | 可选，写入主题默认值（文件挂接忽略；CSV 行级 priority 优先） |
| `submitReview` | 可选，默认 false（主题 CSV 不使用） |

主题 CSV 列：`knowledge_key,knowledge_name`，可选 `description`、`priority`、`tags`（`;`/`|`/`,` 分隔的 tag_code；行级优先于表单）、`category_code`（行级优先于表单 `categoryId`，须为 ACTIVE 分类编码）。

FAQ CSV 同样可选 `category_code`。

FAQ CSV 列：`knowledge_key,knowledge_name,faq_question,faq_answer`，可选 `description`、`priority`。

### 出参 `Result<KnowledgeImportResultVo>`

| 字段 | 说明 |
|------|------|
| `successCount` / `skippedCount` / `failedCount` | 汇总 |
| `items[].knowledgeKey` | 知识键 |
| `items[].itemStatus` | `SUCCESS` / `SKIPPED` / `FAILED` |
| `items[].knowledgeId` / `revisionId` | 成功时有 |
| `items[].errorCode` / `errorMessage` | 失败或跳过说明 |

整批拒绝（空文件）：`knowledge.40010`。主题缺失：`knowledge.40011`。

## 分层

- `KnowledgeItemApi` / `KnowledgeItemController` / `KnowledgeItemService(Impl)`
- 内部调用 `KnowledgeDraftService`、`KnowledgeReviewService`
- 权限：`knowledge_item:import`
