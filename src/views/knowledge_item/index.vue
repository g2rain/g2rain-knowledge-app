<template>
  <div class="knowledge_item-page">
    <el-card class="knowledge_item-page__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item label="名称">
          <el-input v-model="queryForm.knowledgeName" placeholder="知识名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="知识键">
          <el-input v-model="queryForm.knowledgeKey" placeholder="业务唯一键" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryForm.categoryId" placeholder="分类" clearable filterable style="width: 180px">
            <el-option v-for="c in categoryOptions" :key="c.id" :label="c.categoryName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryForm.knowledgeType" placeholder="类型" clearable style="width: 140px">
            <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="启停" clearable style="width: 140px">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
            <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <div class="knowledge_item-page__header">
      <div class="knowledge_item-page__title-group">
        <h2>知识内容</h2>
      </div>
      <div class="knowledge_item-page__actions">
        <el-button v-permission="'knowledge_item:import'" @click="openImport">批量导入</el-button>
        <el-button type="primary" v-permission="'knowledge_item:add'" @click="handleCreate">新建内容</el-button>
      </div>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="knowledgeName" label="名称" min-width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="openVersions(row)">{{ row.knowledgeName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="categoryId" label="分类" width="140">
        <template #default="{ row }">{{ categoryName(row.categoryId) }}</template>
      </el-table-column>
      <el-table-column prop="knowledgeType" label="类型" width="100">
        <template #default="{ row }">{{ typeLabel(row.knowledgeType) }}</template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="90" />
      <el-table-column label="标签" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ formatTags(row.tagsJson) }}</template>
      </el-table-column>
      <el-table-column label="当前生效版本" min-width="140">
        <template #default="{ row }">{{ activeRevisionText(row.id) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">{{ statusLabel(row.status) }}</template>
      </el-table-column>
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openVersions(row)">查看版本</el-button>
          <el-button type="primary" link size="small" v-permission="'knowledge_revision:add'" @click="openVersions(row, true)">
            新增版本
          </el-button>
          <el-button type="primary" v-permission="'knowledge_item:edit'" link size="small" @click="handleEdit(row)">
            {{ $t('G2_BTN_EDIT', '编辑') }}
          </el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>{{ $t('G2_FIELD_ACTION', '操作') }}</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <div class="knowledge_item-page__pagination">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <el-drawer
      v-model="editDrawerVisible"
      :title="isEdit ? '编辑知识内容' : '新建知识内容'"
      :size="OVERLAY_SIZE.drawer"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="96px">
        <el-form-item label="名称" prop="knowledgeName">
          <el-input v-model="editForm.knowledgeName" placeholder="知识名称" />
        </el-form-item>
        <el-form-item label="知识键" prop="knowledgeKey">
          <el-input v-model="editForm.knowledgeKey" placeholder="业务侧稳定标识" :disabled="isEdit" />
          <div class="field-tip">用于对接检索与发布，创建后建议不要轻易修改</div>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="editForm.categoryId" placeholder="选择分类" filterable style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c.id" :label="c.categoryName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="knowledgeType">
          <el-select v-model="editForm.knowledgeType" placeholder="类型" style="width: 100%" :disabled="isEdit">
            <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="启停状态" style="width: 100%">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <div class="field-tip">停用不等同于下线或撤回线上版本，请按实际业务影响确认</div>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="editForm.tagCodes"
            multiple
            filterable
            clearable
            placeholder="选择标签"
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
        <el-form-item label="说明" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="4" placeholder="说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-drawer>

    <RevisionManageDrawer
      v-model="versionDrawerVisible"
      :knowledge-id="versionKnowledgeId"
      :auto-create="openCreateAfterVersion"
      @changed="loadData"
      @update:model-value="(v) => { if (!v) openCreateAfterVersion = false }"
    />

    <el-drawer
      v-model="importDrawerVisible"
      title="批量导入"
      :size="OVERLAY_SIZE.drawer"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-tabs v-model="importTab">
        <el-tab-pane label="主题 CSV" name="items">
          <el-alert
            type="info"
            :closable="false"
            show-icon
            title="第一步：创建 DOCUMENT 主题与空 FILE 草稿。CSV 列：knowledge_key, knowledge_name；可选 description、priority。标签/分类写入主题；已存在 key 跳过。"
            style="margin-bottom: 12px"
          />
          <el-button link type="primary" @click="downloadItemsTemplate">下载 CSV 模板</el-button>
          <el-upload
            style="margin-top: 12px"
            :auto-upload="false"
            :limit="1"
            accept=".csv,text/csv"
            :on-change="onItemsFileChange"
            :on-remove="() => (importItemsFile = null)"
          >
            <el-button>选择 CSV</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="文件挂接" name="files">
          <el-alert
            type="info"
            :closable="false"
            show-icon
            title="第二步：须先主题 CSV。文件名（不含扩展名）= knowledge_key；挂接到已有主题的 FILE 草稿。主题不存在则失败。支持 PDF / Markdown / HTML。"
            style="margin-bottom: 12px"
          />
          <el-upload
            :auto-upload="false"
            multiple
            accept=".pdf,.md,.markdown,.html,.htm"
            :on-change="onImportFilesChange"
            :on-remove="onImportFileRemove"
          >
            <el-button>选择文件</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="FAQ（CSV）" name="faq">
          <el-alert
            type="info"
            :closable="false"
            show-icon
            title="CSV 列：knowledge_key, knowledge_name, faq_question, faq_answer；可选 description、priority。标签/优先级写入主题；已存在 key 将跳过。"
            style="margin-bottom: 12px"
          />
          <el-button link type="primary" @click="downloadFaqTemplate">下载 CSV 模板</el-button>
          <el-upload
            style="margin-top: 12px"
            :auto-upload="false"
            :limit="1"
            accept=".csv,text/csv"
            :on-change="onFaqFileChange"
            :on-remove="() => (importFaqFile = null)"
          >
            <el-button>选择 CSV</el-button>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <el-form label-width="96px" style="margin-top: 16px">
        <el-form-item v-if="importTab !== 'files'" label="分类">
          <el-select v-model="importForm.categoryId" clearable filterable placeholder="可选" style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c.id" :label="c.categoryName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="importTab !== 'files'" label="标签">
          <el-select
            v-model="importForm.tags"
            multiple
            filterable
            clearable
            placeholder="可选，写入本批新建主题"
            style="width: 100%"
          >
            <el-option v-for="tag in tagOptions" :key="tag.tagCode" :label="tag.tagName" :value="tag.tagCode" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="importTab !== 'items'" label="提交审核">
          <el-switch v-model="importForm.submitReview" />
          <div class="field-tip">主题 CSV 仅建主题与空草稿；文件/FAQ 可开启提交审核</div>
        </el-form-item>
      </el-form>

      <el-table v-if="importResult" :data="importResult.items" border stripe style="width: 100%; margin-top: 12px">
        <el-table-column prop="knowledgeKey" label="知识键" min-width="140" show-overflow-tooltip />
        <el-table-column prop="itemStatus" label="结果" width="100" />
        <el-table-column prop="errorCode" label="错误码" width="140" show-overflow-tooltip />
        <el-table-column prop="errorMessage" label="说明" min-width="160" show-overflow-tooltip />
      </el-table>
      <div v-if="importResult" class="field-tip" style="margin-top: 8px">
        成功 {{ importResult.successCount }} / 跳过 {{ importResult.skippedCount }} / 失败
        {{ importResult.failedCount }}
      </div>

      <template #footer>
        <el-button @click="importDrawerVisible = false">关闭</el-button>
        <el-button type="primary" :loading="importSubmitting" @click="submitImport">开始导入</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance, FormRules, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { t } from '@platform/i18n';
import { KnowledgeItemApi } from './api';
import type {
  KnowledgeImportResult,
  KnowledgeItem,
  KnowledgeItemPayload,
  KnowledgeItemQuery,
} from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import { SortableTable, TableColumn, SortManagerButton, QueryForm } from '@g2rain/ui';
import { showErrorMessage } from '@/components';
import { compactQuery } from '@shared/knowledge/entity';
import { OVERLAY_SIZE } from '@shared/knowledge/overlay';
import { ITEM_STATUS_OPTIONS, KNOWLEDGE_TYPE_OPTIONS, resolveTypeLabel } from '@/views/knowledge_revision/status';
import { KnowledgeCategoryApi } from '@/views/knowledge_category/api';
import type { KnowledgeCategory } from '@/views/knowledge_category/type';
import { KnowledgeTagApi } from '@/views/knowledge_tag/api';
import type { KnowledgeTag } from '@/views/knowledge_tag/type';
import { KnowledgeReleaseApi } from '@/views/knowledge_release/api';
import { KnowledgeRevisionApi } from '@/views/knowledge_revision/api';
import RevisionManageDrawer from '@/views/knowledge_revision/RevisionManageDrawer.vue';

const statusOptions = ITEM_STATUS_OPTIONS;
const typeOptions = KNOWLEDGE_TYPE_OPTIONS;
const statusLabel = (s?: string) => statusOptions.find((o) => o.value === s)?.label || s || '-';
const typeLabel = resolveTypeLabel;

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);
const baseQueryForm = ref<BaseSelectListDto>({});
const queryForm = reactive({
  knowledgeName: '',
  knowledgeKey: '',
  categoryId: undefined as number | undefined,
  knowledgeType: '',
  status: '',
});
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 });
const tableData = ref<KnowledgeItem[]>([]);
const categoryOptions = ref<KnowledgeCategory[]>([]);
const activeRevisionMap = ref<Record<number, string>>({});

const categoryName = (id?: number) => categoryOptions.value.find((c) => c.id === id)?.categoryName || '-';
const activeRevisionText = (knowledgeId: number) => activeRevisionMap.value[knowledgeId] || '-';

const loadCategories = async () => {
  try {
    categoryOptions.value = await KnowledgeCategoryApi.list({ status: 'ACTIVE' });
  } catch {
    categoryOptions.value = [];
  }
};

const loadActiveRevisions = async (items: KnowledgeItem[]) => {
  const map: Record<number, string> = {};
  await Promise.all(
    items.map(async (item) => {
      try {
        const releases = await KnowledgeReleaseApi.list({ knowledgeId: item.id });
        const activeId = releases[0]?.activeRevisionId;
        if (!activeId) return;
        const revisions = await KnowledgeRevisionApi.list({ id: activeId });
        if (revisions[0]) map[item.id] = revisions[0].revisionNo;
      } catch {
        /* 忽略单行失败 */
      }
    }),
  );
  activeRevisionMap.value = map;
};

const loadData = async () => {
  try {
    const query = compactQuery({ ...baseQueryForm.value, ...queryForm }) as KnowledgeItemQuery;
    const pageData = await KnowledgeItemApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeItemQuery);
    tableData.value = pageData.records;
    pagination.total = pageData.total;
    await loadActiveRevisions(pageData.records);
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : t('G2_MSG_LOAD_FAIL', '加载列表失败'));
  }
};

const handleSortChange = (params: Record<string, string>) => queryFormRef.value?.updateSorts(params);
const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};
const handleReset = () => {
  baseQueryForm.value = {};
  Object.assign(queryForm, {
    knowledgeName: '',
    knowledgeKey: '',
    categoryId: undefined,
    knowledgeType: '',
    status: '',
  });
  pagination.pageNum = 1;
  loadData();
};
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadData();
};
const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  loadData();
};

const versionDrawerVisible = ref(false);
const versionKnowledgeId = ref<number | null>(null);
const openCreateAfterVersion = ref(false);

const openVersions = (row: KnowledgeItem, create = false) => {
  versionKnowledgeId.value = row.id;
  versionDrawerVisible.value = true;
  openCreateAfterVersion.value = create;
};

const editDrawerVisible = ref(false);
const isEdit = ref(false);
const editFormRef = ref<FormInstance | null>(null);
const tagOptions = ref<KnowledgeTag[]>([]);

const loadTags = async () => {
  try {
    tagOptions.value = await KnowledgeTagApi.list({ status: 'ACTIVE' });
  } catch {
    tagOptions.value = [];
  }
};

const ensureTagsLoaded = async () => {
  if (!tagOptions.value.length) {
    await loadTags();
  }
};

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
      return tag ? tag.tagName : code;
    })
    .join('、');
};

const editForm = reactive({
  id: undefined as number | undefined,
  version: undefined as number | undefined,
  knowledgeName: '',
  knowledgeKey: '',
  categoryId: undefined as number | undefined,
  knowledgeType: 'DOCUMENT',
  status: 'ACTIVE',
  description: '',
  priority: 0,
  tagCodes: [] as string[],
});
const editRules: FormRules = {
  knowledgeName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  knowledgeKey: [{ required: true, message: '请输入知识键', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  knowledgeType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const handleCreate = async () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  Object.assign(editForm, {
    id: undefined,
    version: undefined,
    knowledgeName: '',
    knowledgeKey: '',
    categoryId: undefined,
    knowledgeType: 'DOCUMENT',
    status: 'ACTIVE',
    description: '',
    priority: 0,
    tagCodes: [],
  });
  editDrawerVisible.value = true;
  await ensureTagsLoaded();
};

const handleEdit = async (row: KnowledgeItem) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  Object.assign(editForm, {
    id: row.id,
    version: row.version,
    knowledgeName: row.knowledgeName,
    knowledgeKey: row.knowledgeKey,
    categoryId: row.categoryId,
    knowledgeType: row.knowledgeType,
    status: row.status,
    description: row.description,
    priority: row.priority ?? 0,
    tagCodes: parseTagCodes(row.tagsJson),
  });
  editDrawerVisible.value = true;
  await ensureTagsLoaded();
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate().catch(() => false);
  if (!valid) return;
  const payload: KnowledgeItemPayload = {
    knowledgeName: editForm.knowledgeName,
    knowledgeKey: editForm.knowledgeKey,
    categoryId: editForm.categoryId,
    knowledgeType: editForm.knowledgeType,
    status: editForm.status,
    description: editForm.description,
    priority: editForm.priority,
    tagsJson: JSON.stringify(editForm.tagCodes || []),
  };
  if (isEdit.value) {
    payload.id = editForm.id;
    payload.version = editForm.version;
  }
  try {
    const id = await KnowledgeItemApi.save(payload);
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    editDrawerVisible.value = false;
    await loadData();
    if (!isEdit.value) {
      versionKnowledgeId.value = id;
      versionDrawerVisible.value = true;
    }
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : t('G2_MSG_SAVE_FAIL', '保存失败'));
  }
};

const importDrawerVisible = ref(false);
const importTab = ref<'items' | 'files' | 'faq'>('items');
const importSubmitting = ref(false);
const importItemsFile = ref<File | null>(null);
const importFaqFile = ref<File | null>(null);
const importFiles = ref<File[]>([]);
const importResult = ref<KnowledgeImportResult | null>(null);
const importForm = reactive({
  categoryId: undefined as number | undefined,
  tags: [] as string[],
  submitReview: false,
});

const openImport = async () => {
  importTab.value = 'items';
  importItemsFile.value = null;
  importFaqFile.value = null;
  importFiles.value = [];
  importResult.value = null;
  importForm.categoryId = undefined;
  importForm.tags = [];
  importForm.submitReview = false;
  importDrawerVisible.value = true;
  await ensureTagsLoaded();
};

const downloadCsv = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const downloadItemsTemplate = () => {
  downloadCsv(
    'knowledge_key,knowledge_name,description,priority\n' +
      'sample_doc,示例文档,可选说明,0\n',
    'knowledge-items-import-template.csv',
  );
};

const downloadFaqTemplate = () => {
  downloadCsv(
    'knowledge_key,knowledge_name,faq_question,faq_answer,description,priority\n' +
      'sample_faq,示例FAQ,标准问题,标准答案,可选说明,0\n',
    'knowledge-faq-import-template.csv',
  );
};

const onItemsFileChange = (file: UploadFile) => {
  importItemsFile.value = (file.raw as File) || null;
};

const onFaqFileChange = (file: UploadFile) => {
  importFaqFile.value = (file.raw as File) || null;
};

const onImportFilesChange = (_file: UploadFile, fileList: UploadFile[]) => {
  importFiles.value = fileList.map((item) => item.raw as File).filter(Boolean);
};

const onImportFileRemove = (_file: UploadFile, fileList: UploadFile[]) => {
  importFiles.value = fileList.map((item) => item.raw as File).filter(Boolean);
};

const submitImport = async () => {
  importSubmitting.value = true;
  try {
    const options = {
      categoryId: importForm.categoryId,
      tags: importForm.tags.length ? [...importForm.tags] : undefined,
      submitReview: importForm.submitReview,
    };
    let result: KnowledgeImportResult;
    if (importTab.value === 'items') {
      if (!importItemsFile.value) {
        showErrorMessage('请先选择主题 CSV 文件');
        return;
      }
      result = await KnowledgeItemApi.importItems(importItemsFile.value, {
        categoryId: options.categoryId,
        tags: options.tags,
      });
    } else if (importTab.value === 'faq') {
      if (!importFaqFile.value) {
        showErrorMessage('请先选择 CSV 文件');
        return;
      }
      result = await KnowledgeItemApi.importFaq(importFaqFile.value, options);
    } else {
      if (!importFiles.value.length) {
        showErrorMessage('请先选择要导入的文件');
        return;
      }
      result = await KnowledgeItemApi.importFiles(importFiles.value, {
        submitReview: options.submitReview,
      });
    }
    importResult.value = result;
    ElMessage.success(
      `导入完成：成功 ${result.successCount}，跳过 ${result.skippedCount}，失败 ${result.failedCount}`,
    );
    if (result.successCount > 0) {
      await loadData();
    }
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '批量导入失败');
  } finally {
    importSubmitting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadCategories(), loadTags()]);
  await loadData();
});
</script>

<style scoped>
.knowledge_item-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}
.knowledge_item-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_item-page__actions {
  display: flex;
  gap: 8px;
}
.knowledge_item-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_item-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_item-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.field-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}
</style>
