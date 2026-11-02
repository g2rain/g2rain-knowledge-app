<template>
  <div class="knowledge_answer_template-page">
    <el-card class="knowledge_answer_template-page__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item :label="$t('G2_FIELD_ORGAN', '所属机构')">
          <OrganSelect v-model="queryForm.organId" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_CODE', '编码')">
          <el-input v-model="queryForm.templateCode" :placeholder="$t('G2_FIELD_CODE', '编码')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_NAME', '名称')">
          <el-input v-model="queryForm.templateName" :placeholder="$t('G2_FIELD_NAME', '名称')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_STATUS', '状态')">
          <DictSelect
            v-model="queryForm.status"
            usage-code="ENABLE_STATUS"
            :placeholder="$t('G2_PH_STATUS', '请选择状态')"
            clearable
            width="160px"
          />
        </el-form-item>
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
            <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <div class="knowledge_answer_template-page__header">
      <div class="knowledge_answer_template-page__title-group">
        <h2>{{ $t('KN_TEMPLATE_TITLE', '回答模板') }}</h2>
      </div>
      <el-button type="primary" v-permission="'knowledge_answer_template:add'" @click="handleCreate">{{ $t('KN_TEMPLATE_BTN_ADD', '新增模板') }}</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column :label="$t('G2_FIELD_ORGAN', '所属机构')" min-width="140" show-overflow-tooltip>
        <template #default="{ row }">{{ organName(row) }}</template>
      </el-table-column>
      <el-table-column prop="templateCode" :label="$t('G2_FIELD_CODE', '编码')" min-width="140" />
      <el-table-column prop="templateName" :label="$t('G2_FIELD_NAME', '名称')" min-width="160" />
      <el-table-column prop="status" :label="$t('G2_FIELD_STATUS', '状态')" width="100">
        <template #default="{ row }">
          <DictText :value="row.status" usage-code="ENABLE_STATUS" />
        </template>
      </el-table-column>
      <el-table-column prop="systemPrompt" :label="$t('KN_FIELD_PROMPT', '提示词')" min-width="220" show-overflow-tooltip />
      <el-table-column prop="remark" :label="$t('G2_FIELD_DESCRIPTION', '说明')" min-width="140" show-overflow-tooltip />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="260">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" link size="small" @click="handlePreview(row)">{{ $t('KN_BTN_PREVIEW', '预览') }}</el-button>
          <el-button type="primary" v-permission="'knowledge_answer_template:edit'" link size="small" @click="handleEdit(row)">
            {{ $t('G2_BTN_EDIT', '编辑') }}
          </el-button>
          <el-button type="danger" v-permission="'knowledge_answer_template:delete'" link size="small" @click="handleDelete(row)">
            {{ $t('G2_BTN_DELETE', '删除') }}
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

    <div class="knowledge_answer_template-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="isEdit ? $t('KN_TEMPLATE_DLG_EDIT', '编辑模板') : $t('KN_TEMPLATE_DLG_ADD', '新增模板')" width="720px" destroy-on-close>
      <el-alert
        type="info"
        :closable="false"
        show-icon
        :title="$t('KN_TEMPLATE_TIP_EDIT', '停用后问答将无法选择该模板；提示词仅用于服务端组装，预览不会调用模型。')"
        style="margin-bottom: 16px"
      />
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="88px">
        <el-form-item :label="$t('G2_FIELD_CODE', '编码')" prop="templateCode">
          <el-input v-model="editForm.templateCode" :placeholder="$t('G2_FIELD_CODE', '编码')" :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_NAME', '名称')" prop="templateName">
          <el-input v-model="editForm.templateName" :placeholder="$t('G2_FIELD_NAME', '名称')" />
        </el-form-item>
        <el-form-item :label="$t('KN_FIELD_PROMPT', '提示词')" prop="systemPrompt">
          <el-input
            v-model="editForm.systemPrompt"
            type="textarea"
            :rows="12"
            maxlength="8000"
            show-word-limit
            :placeholder="$t('KN_FIELD_PROMPT', '提示词')"
          />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_STATUS', '状态')" prop="status">
          <DictSelect v-model="editForm.status" usage-code="ENABLE_STATUS" :placeholder="$t('G2_PH_STATUS', '请选择状态')" width="100%" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_DESCRIPTION', '说明')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :rows="2" :placeholder="$t('G2_FIELD_DESCRIPTION', '说明')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">{{ $t('G2_BTN_CANCEL', '取消') }}</el-button>
        <el-button type="primary" @click="submitEdit">{{ $t('G2_BTN_SAVE', '保存') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" :title="$t('KN_TEMPLATE_DETAIL', '模板明细')" width="720px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_ORGAN', '所属机构')">{{ organName(currentRow) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_CODE', '编码')">{{ currentRow?.templateCode }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_NAME', '名称')">{{ currentRow?.templateName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_STATUS', '状态')">
          <DictText :value="currentRow?.status" usage-code="ENABLE_STATUS" />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('KN_FIELD_PROMPT', '提示词')">
          <pre class="prompt-preview">{{ currentRow?.systemPrompt }}</pre>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_DESCRIPTION', '说明')">{{ currentRow?.remark }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">{{ $t('G2_BTN_CLOSE', '关闭') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" :title="$t('KN_TEMPLATE_PREVIEW', '提示词预览（不调用模型）')" width="720px">
      <el-alert type="warning" :closable="false" show-icon :title="$t('KN_TEMPLATE_PREVIEW_TIP', '仅展示模板文本，未发起模型调用。')" style="margin-bottom: 12px" />
      <pre class="prompt-preview">{{ previewText }}</pre>
      <template #footer>
        <el-button type="primary" @click="previewVisible = false">{{ $t('G2_BTN_CLOSE', '关闭') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { t } from '@platform/i18n';
import { KnowledgeAnswerTemplateApi } from './api';
import type {
  KnowledgeAnswerTemplate,
  KnowledgeAnswerTemplatePayload,
  KnowledgeAnswerTemplateQuery,
} from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import { SortableTable, TableColumn, SortManagerButton, QueryForm } from '@g2rain/ui';
import { OrganSelect, DictSelect, DictText } from '@g2rain/ui/platform';
import { compactQuery } from '@shared/knowledge/entity';
import { ensureOrganNames, organName } from '@shared/knowledge/organ-name';

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);
const baseQueryForm = ref<BaseSelectListDto>({});
const queryForm = reactive({
  organId: undefined as number | null | undefined,
  templateCode: '',
  templateName: '',
  status: '',
});
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 });
const tableData = ref<KnowledgeAnswerTemplate[]>([]);

const loadData = async () => {
  try {
    const query = compactQuery({ ...baseQueryForm.value, ...queryForm }) as KnowledgeAnswerTemplateQuery;
    const pageData = await KnowledgeAnswerTemplateApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeAnswerTemplateQuery);
    tableData.value = pageData.records;
    pagination.total = pageData.total;
    await ensureOrganNames(pageData.records);
  } catch {
    // 请求失败已由 http 层统一提示
  }
};

const handleSortChange = (params: Record<string, string>) => queryFormRef.value?.updateSorts(params);
const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};
const handleReset = () => {
  baseQueryForm.value = {};
  queryForm.organId = undefined;
  queryForm.templateCode = '';
  queryForm.templateName = '';
  queryForm.status = '';
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

const currentRow = ref<KnowledgeAnswerTemplate | null>(null);
const detailDialogVisible = ref(false);
const previewVisible = ref(false);
const previewText = ref('');

const handleView = (row: KnowledgeAnswerTemplate) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};
const handlePreview = (row: KnowledgeAnswerTemplate) => {
  previewText.value = row.systemPrompt || '';
  previewVisible.value = true;
};

const handleDelete = (row: KnowledgeAnswerTemplate) => {
  ElMessageBox.confirm(t('KN_TEMPLATE_DEL_CONFIRM', { name: row.templateName }, '确认删除模板「{name}」吗？'), t('G2_LBL_TIP', '提示'), { type: 'warning' })
    .then(async () => {
      await KnowledgeAnswerTemplateApi.remove(row.id);
      if (tableData.value.length === 1 && pagination.pageNum > 1) pagination.pageNum--;
      await loadData();
      ElMessage.success(t('G2_MSG_DELETE_OK', '删除成功'));
    })
    .catch(() => {});
};

const editDialogVisible = ref(false);
const isEdit = ref(false);
const editFormRef = ref<FormInstance | null>(null);
const editForm = reactive({
  id: undefined as number | undefined,
  templateCode: '',
  templateName: '',
  systemPrompt: '',
  status: 'ACTIVE',
  remark: '',
});
const editRules: FormRules = {
  templateCode: [{ required: true, message: '请输入模板编码', trigger: 'blur' }],
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  systemPrompt: [{ required: true, message: '请输入提示词', trigger: 'blur' }],
  status: [{ required: true, message: t('G2_PH_STATUS', '请选择状态'), trigger: 'change' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  Object.assign(editForm, {
    id: undefined,
    templateCode: '',
    templateName: '',
    systemPrompt: '',
    status: 'ACTIVE',
    remark: '',
  });
  editDialogVisible.value = true;
};

const handleEdit = (row: KnowledgeAnswerTemplate) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  Object.assign(editForm, {
    id: row.id,
    templateCode: row.templateCode,
    templateName: row.templateName,
    systemPrompt: row.systemPrompt,
    status: row.status,
    remark: row.remark,
  });
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate().catch(() => false);
  if (!valid) return;
  const payload: KnowledgeAnswerTemplatePayload = {
    templateCode: editForm.templateCode,
    templateName: editForm.templateName,
    systemPrompt: editForm.systemPrompt,
    status: editForm.status,
    remark: editForm.remark,
  };
  if (isEdit.value) payload.id = editForm.id;
  await KnowledgeAnswerTemplateApi.save(payload);
  ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
  await loadData();
  editDialogVisible.value = false;
};

onMounted(() => loadData());
</script>

<style scoped>
.knowledge_answer_template-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}
.knowledge_answer_template-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_answer_template-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_answer_template-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_answer_template-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.prompt-preview {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-family: inherit;
  line-height: 1.5;
}
</style>
