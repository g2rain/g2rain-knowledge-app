<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    :size="OVERLAY_SIZE.largeDrawer"
    destroy-on-close
    @closed="handleClosed"
  >
    <div v-loading="loading" class="revision-drawer">
      <el-alert
        v-if="item"
        type="info"
        :closable="false"
        show-icon
        class="revision-drawer__summary"
      >
        <template #title>
          <span>{{ item.knowledgeName }}</span>
          <el-tag size="small" style="margin-left: 8px">{{ typeLabel(item.knowledgeType) }}</el-tag>
          <el-tag size="small" :type="item.status === 'ACTIVE' ? 'success' : 'info'" style="margin-left: 8px">
            {{ item.status === 'ACTIVE' ? '启用' : '停用' }}
          </el-tag>
        </template>
        <div>知识键：{{ item.knowledgeKey }} · 当前线上版本：{{ activeRevisionLabel }}</div>
      </el-alert>

      <template v-if="viewMode === 'list'">
        <div class="revision-drawer__toolbar">
          <span>版本列表</span>
          <el-button type="primary" v-permission="'knowledge_revision:add'" @click="openCreate">新增版本</el-button>
        </div>
        <el-table :data="revisions" border stripe highlight-current-row @row-click="openDetail">
          <el-table-column prop="revisionNo" label="版本号" width="120" />
          <el-table-column prop="sourceType" label="类型" width="90">
            <template #default="{ row }">{{ typeLabel(row.sourceType) }}</template>
          </el-table-column>
          <el-table-column prop="revisionStatus" label="状态" min-width="140">
            <template #default="{ row }">
              <div>{{ getRevisionStatusInfo(row.revisionStatus).label }}</div>
              <div class="muted">{{ getRevisionStatusInfo(row.revisionStatus).menuHint }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="90" />
          <el-table-column prop="updateTime" label="更新时间" width="170" />
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click.stop="openDetail(row)">查看</el-button>
              <el-button
                v-if="row.revisionStatus === 'DRAFT'"
                type="primary"
                link
                size="small"
                v-permission="'knowledge_revision:edit'"
                @click.stop="openEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="row.revisionStatus === 'DRAFT'"
                type="primary"
                link
                size="small"
                v-permission="'knowledge_revision:submit-review'"
                @click.stop="submitReview(row)"
              >
                提交审核
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-else-if="current">
        <div class="revision-drawer__toolbar">
          <el-button link type="primary" @click="backToList">← 返回列表</el-button>
          <div class="revision-drawer__actions">
            <el-button
              v-if="current.revisionStatus === 'DRAFT'"
              v-permission="'knowledge_revision:edit'"
              @click="openEdit(current)"
            >
              编辑
            </el-button>
            <el-button
              v-if="current.revisionStatus === 'DRAFT'"
              type="primary"
              v-permission="'knowledge_revision:submit-review'"
              @click="submitReview(current)"
            >
              提交审核
            </el-button>
          </div>
        </div>
        <el-alert
          :title="formatNextStepHint(current.revisionStatus) || getRevisionStatusInfo(current.revisionStatus).label"
          type="success"
          :closable="false"
          show-icon
          style="margin-bottom: 12px"
        />
        <el-tabs v-model="detailTab">
          <el-tab-pane label="内容" name="content">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="版本号">{{ current.revisionNo }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{ typeLabel(current.sourceType) }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ getRevisionStatusInfo(current.revisionStatus).label }}</el-descriptions-item>
              <el-descriptions-item label="优先级">{{ current.priority }}</el-descriptions-item>
              <el-descriptions-item label="标签">{{ formatTags(current.tagsJson) }}</el-descriptions-item>
              <template v-if="current.sourceType === 'FAQ'">
                <el-descriptions-item label="标准问题">{{ current.faqQuestion }}</el-descriptions-item>
                <el-descriptions-item label="标准答案">
                  <pre class="block-text">{{ current.faqAnswer }}</pre>
                </el-descriptions-item>
              </template>
              <template v-else>
                <el-descriptions-item label="源文件">{{ current.sourceFileName || '未上传' }}</el-descriptions-item>
                <el-descriptions-item label="下载">
                  <el-button
                    v-if="current.sourceFileName"
                    type="primary"
                    link
                    v-permission="'knowledge_revision:download-source'"
                    @click="downloadCurrent"
                  >
                    下载原文
                  </el-button>
                  <span v-else class="muted">暂无文件</span>
                </el-descriptions-item>
              </template>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="审核" name="review">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="审核意见">{{ current.reviewComment || '-' }}</el-descriptions-item>
              <el-descriptions-item label="审核时间">{{ current.reviewTime || '-' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="处理结果" name="process">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="切片数">{{ current.chunkCount ?? '-' }}</el-descriptions-item>
              <el-descriptions-item label="索引状态">{{ current.indexStatus || '-' }}</el-descriptions-item>
              <el-descriptions-item label="下一步">{{ formatNextStepHint(current.revisionStatus) }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="切片" name="chunks">
            <el-table :data="chunks" border stripe max-height="420">
              <el-table-column prop="chunkNo" label="序号" width="80" />
              <el-table-column prop="titlePath" label="标题路径" min-width="180" show-overflow-tooltip />
              <el-table-column label="页码" width="100">
                <template #default="{ row }">
                  {{ row.pageStart }}{{ row.pageEnd && row.pageEnd !== row.pageStart ? `-${row.pageEnd}` : '' }}
                </template>
              </el-table-column>
              <el-table-column prop="tokenCount" label="Token" width="90" />
              <el-table-column prop="chunkStatus" label="状态" width="120" />
            </el-table>
            <el-empty v-if="!chunks.length" description="暂无切片" :image-size="72" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>

    <el-dialog
      v-model="editVisible"
      :title="editIsCreate ? '新增版本' : '编辑版本'"
      :width="OVERLAY_SIZE.editDialog"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="版本号" prop="revisionNo">
          <el-input v-model="editForm.revisionNo" placeholder="如 v1 或 2026.10.17" />
        </el-form-item>
        <el-form-item v-if="editIsCreate" label="来源类型" prop="sourceType">
          <el-radio-group v-model="editForm.sourceType" disabled>
            <el-radio value="FILE">文档</el-radio>
            <el-radio value="FAQ">FAQ</el-radio>
          </el-radio-group>
          <div class="field-tip">由来源主题类型决定：文档主题 → 文件，FAQ 主题 → FAQ</div>
        </el-form-item>
        <template v-if="editForm.sourceType === 'FAQ'">
          <el-form-item label="标准问题" prop="faqQuestion">
            <el-input v-model="editForm.faqQuestion" placeholder="标准问题" />
          </el-form-item>
          <el-form-item label="标准答案" prop="faqAnswer">
            <el-input v-model="editForm.faqAnswer" type="textarea" :rows="6" placeholder="标准答案" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="源文件" :prop="editIsCreate ? 'file' : undefined">
            <el-upload
              :auto-upload="false"
              :limit="1"
              :on-change="onFileChange"
              :on-remove="() => (editForm.file = null)"
              accept=".pdf,.md,.markdown,.html,.htm"
            >
              <el-button>选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">支持 PDF / Markdown / HTML；保存后上传</div>
              </template>
            </el-upload>
          </el-form-item>
        </template>
        <el-form-item label="标签">
          <el-select
            v-model="editForm.tagCodes"
            multiple
            filterable
            clearable
            placeholder="选择标签（提交编码）"
            style="width: 100%"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag.tagCode"
              :label="`${tag.tagName}（${tag.tagCode}）`"
              :value="tag.tagCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="editForm.priority" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveRevision">保存</el-button>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules, UploadFile } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { KnowledgeItemApi } from '@/views/knowledge_item/api';
import type { KnowledgeItem } from '@/views/knowledge_item/type';
import { KnowledgeRevisionApi } from './api';
import type { KnowledgeRevision, KnowledgeRevisionPayload } from './type';
import { KnowledgeChunkApi } from '@/views/knowledge_chunk/api';
import type { KnowledgeChunk } from '@/views/knowledge_chunk/type';
import { KnowledgeReleaseApi } from '@/views/knowledge_release/api';
import { KnowledgeTagApi } from '@/views/knowledge_tag/api';
import type { KnowledgeTag } from '@/views/knowledge_tag/type';
import { showErrorMessage } from '@/components';
import { OVERLAY_SIZE } from '@shared/knowledge/overlay';
import {
  formatNextStepHint,
  getRevisionStatusInfo,
  resolveTypeLabel,
} from './status';

const props = defineProps<{
  modelValue: boolean;
  knowledgeId: number | null;
  preferRevisionId?: number | null;
  /** 打开后自动进入新增版本流程 */
  autoCreate?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
  changed: [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const loading = ref(false);
const saving = ref(false);
const item = ref<KnowledgeItem | null>(null);
const revisions = ref<KnowledgeRevision[]>([]);
const current = ref<KnowledgeRevision | null>(null);
const chunks = ref<KnowledgeChunk[]>([]);
const viewMode = ref<'list' | 'detail'>('list');
const detailTab = ref('content');
const activeRevisionId = ref<number | null>(null);
const tagOptions = ref<KnowledgeTag[]>([]);

const drawerTitle = computed(() => (item.value ? `版本管理 · ${item.value.knowledgeName}` : '版本管理'));
const activeRevisionLabel = computed(() => {
  if (!activeRevisionId.value) return '无';
  const hit = revisions.value.find((r) => r.id === activeRevisionId.value);
  return hit ? hit.revisionNo : `#${activeRevisionId.value}`;
});

const typeLabel = resolveTypeLabel;

const parseTagCodes = (tagsJson?: string): string[] => {
  if (!tagsJson) return [];
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const formatTags = (tagsJson?: string) => {
  const codes = parseTagCodes(tagsJson);
  if (!codes.length) return '-';
  return codes
    .map((code) => {
      const tag = tagOptions.value.find((t) => t.tagCode === code);
      return tag ? `${tag.tagName}（${code}）` : code;
    })
    .join('、');
};

const loadTags = async () => {
  try {
    tagOptions.value = await KnowledgeTagApi.list({ status: 'ACTIVE' });
  } catch {
    tagOptions.value = [];
  }
};

const loadData = async () => {
  if (!props.knowledgeId) return;
  loading.value = true;
  try {
    item.value = await KnowledgeItemApi.getById(props.knowledgeId);
    revisions.value = await KnowledgeRevisionApi.list({ knowledgeId: props.knowledgeId });
    const releases = await KnowledgeReleaseApi.list({ knowledgeId: props.knowledgeId });
    activeRevisionId.value = releases[0]?.activeRevisionId ?? null;
    if (props.preferRevisionId) {
      const prefer = revisions.value.find((r) => r.id === props.preferRevisionId);
      if (prefer) await openDetail(prefer);
    } else if (props.autoCreate) {
      await openCreate();
    }
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '加载版本失败');
  } finally {
    loading.value = false;
  }
};

const openDetail = async (row: KnowledgeRevision) => {
  try {
    current.value = await KnowledgeRevisionApi.getById(row.id);
    viewMode.value = 'detail';
    detailTab.value = 'content';
    chunks.value = await KnowledgeChunkApi.list({ revisionId: row.id });
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '加载版本详情失败');
  }
};

const backToList = () => {
  viewMode.value = 'list';
  current.value = null;
  chunks.value = [];
};

const downloadCurrent = async () => {
  if (!current.value) return;
  try {
    await KnowledgeRevisionApi.downloadSource(current.value.id, current.value.sourceFileName || 'source');
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '下载失败');
  }
};

const editVisible = ref(false);
const editIsCreate = ref(false);
const editFormRef = ref<FormInstance | null>(null);
const editForm = reactive({
  id: undefined as number | undefined,
  version: undefined as number | undefined,
  revisionNo: '',
  sourceType: 'FILE',
  faqQuestion: '',
  faqAnswer: '',
  priority: 0,
  tagCodes: [] as string[],
  file: null as File | null,
});

const editRules: FormRules = {
  revisionNo: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  sourceType: [{ required: true, message: '请选择来源类型', trigger: 'change' }],
  faqQuestion: [
    {
      validator: (_r, _v, cb) => {
        if (editForm.sourceType === 'FAQ' && !editForm.faqQuestion) cb(new Error('请输入标准问题'));
        else cb();
      },
      trigger: 'blur',
    },
  ],
  faqAnswer: [
    {
      validator: (_r, _v, cb) => {
        if (editForm.sourceType === 'FAQ' && !editForm.faqAnswer) cb(new Error('请输入标准答案'));
        else cb();
      },
      trigger: 'blur',
    },
  ],
};

const onFileChange = (file: UploadFile) => {
  editForm.file = (file.raw as File) || null;
};

const openCreate = async () => {
  if (!props.knowledgeId) return;
  const draft = revisions.value.find((r) => r.revisionStatus === 'DRAFT');
  if (draft) {
    try {
      await ElMessageBox.confirm(
        `该主题已有草稿版本「${draft.revisionNo}」，是否打开已有草稿？`,
        '提示',
        { type: 'warning', confirmButtonText: '打开草稿', cancelButtonText: '取消' },
      );
      await openDetail(draft);
      openEdit(draft);
    } catch {
      /* 用户取消 */
    }
    return;
  }
  editIsCreate.value = true;
  Object.assign(editForm, {
    id: undefined,
    version: undefined,
    revisionNo: '',
    sourceType: item.value?.knowledgeType === 'FAQ' ? 'FAQ' : 'FILE',
    faqQuestion: '',
    faqAnswer: '',
    priority: 0,
    tagCodes: [],
    file: null,
  });
  editVisible.value = true;
};

const openEdit = (row: KnowledgeRevision) => {
  editIsCreate.value = false;
  Object.assign(editForm, {
    id: row.id,
    version: row.version,
    revisionNo: row.revisionNo,
    sourceType: row.sourceType,
    faqQuestion: row.faqQuestion || '',
    faqAnswer: row.faqAnswer || '',
    priority: row.priority ?? 0,
    tagCodes: parseTagCodes(row.tagsJson),
    file: null,
  });
  editVisible.value = true;
};

const saveRevision = async () => {
  if (!editFormRef.value || !props.knowledgeId) return;
  const valid = await editFormRef.value.validate().catch(() => false);
  if (!valid) return;
  if (editForm.sourceType === 'FILE' && editIsCreate.value && !editForm.file) {
    ElMessage.warning('请选择源文件');
    return;
  }
  saving.value = true;
  try {
    const payload: KnowledgeRevisionPayload = {
      knowledgeId: props.knowledgeId,
      revisionNo: editForm.revisionNo,
      sourceType: editForm.sourceType,
      priority: editForm.priority,
      tagsJson: JSON.stringify(editForm.tagCodes || []),
    };
    if (editForm.sourceType === 'FAQ') {
      payload.faqQuestion = editForm.faqQuestion;
      payload.faqAnswer = editForm.faqAnswer;
    }
    if (!editIsCreate.value) {
      payload.id = editForm.id;
      payload.version = editForm.version;
    }
    const id = await KnowledgeRevisionApi.save(payload);
    const revisionId = editIsCreate.value ? id : (editForm.id as number);
    if (editForm.sourceType === 'FILE' && editForm.file) {
      const latest = await KnowledgeRevisionApi.getById(revisionId);
      await KnowledgeRevisionApi.replaceFile(revisionId, latest.version, editForm.file);
    }
    ElMessage.success('版本已保存');
    editVisible.value = false;
    emit('changed');
    await loadData();
    const saved = revisions.value.find((r) => r.id === revisionId);
    if (saved) await openDetail(saved);
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '保存版本失败');
  } finally {
    saving.value = false;
  }
};

const submitReview = async (row: KnowledgeRevision) => {
  try {
    const latest = await KnowledgeRevisionApi.getById(row.id);
    if (latest.sourceType === 'FILE' && !latest.sourceFileName) {
      ElMessage.warning('请先上传源文件再提交审核');
      return;
    }
    await ElMessageBox.confirm(`确认提交版本「${latest.revisionNo}」审核？`, '提交审核', { type: 'warning' });
    await KnowledgeRevisionApi.submitReview({
      revisionId: latest.id,
      expectedVersion: latest.version,
    });
    ElMessage.success('已提交审核。下一站：内容审核');
    emit('changed');
    await loadData();
    if (viewMode.value === 'detail') {
      const refreshed = revisions.value.find((r) => r.id === latest.id);
      if (refreshed) await openDetail(refreshed);
    }
  } catch (error: unknown) {
    if (error === 'cancel' || error === 'close') return;
    showErrorMessage(error instanceof Error ? error.message : '提交审核失败');
  }
};

const handleClosed = () => {
  viewMode.value = 'list';
  current.value = null;
  chunks.value = [];
  item.value = null;
  revisions.value = [];
};

watch(
  () => [props.modelValue, props.knowledgeId] as const,
  ([open, kid]) => {
    if (open && kid) {
      void loadTags();
      void loadData();
    }
  },
);
</script>

<style scoped>
.revision-drawer__summary {
  margin-bottom: 16px;
}
.revision-drawer__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.revision-drawer__actions {
  display: flex;
  gap: 8px;
}
.muted {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.block-text {
  white-space: pre-wrap;
  margin: 0;
  font-family: inherit;
}
.field-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}
</style>
