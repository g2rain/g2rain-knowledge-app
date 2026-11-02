<template>
  <div class="knowledge_tag-page">
    <el-card class="knowledge_tag-page__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item :label="$t('G2_FIELD_ORGAN', '所属机构')">
          <OrganSelect v-model="queryForm.organId" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_CODE', '编码')">
          <el-input v-model="queryForm.tagCode" :placeholder="$t('G2_PH_CODE', '请输入编码')" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_NAME', '名称')">
          <el-input v-model="queryForm.tagName" :placeholder="$t('G2_PH_NAME', '请输入名称')" clearable style="width: 200px" />
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

    <div class="knowledge_tag-page__header">
      <div class="knowledge_tag-page__title-group">
        <h2>{{ $t('G2_FIELD_TAG', '标签') }}</h2>
      </div>
      <el-button type="primary" v-permission="'knowledge_tag:add'" @click="handleCreate">{{ $t('G2_BTN_ADD_TAG', '新增标签') }}</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column :label="$t('G2_FIELD_ORGAN', '所属机构')" min-width="140" show-overflow-tooltip>
        <template #default="{ row }">{{ organName(row) }}</template>
      </el-table-column>
      <el-table-column prop="tagCode" :label="$t('G2_FIELD_CODE', '编码')" min-width="140" />
      <el-table-column prop="tagName" :label="$t('G2_FIELD_NAME', '名称')" min-width="160" />
      <el-table-column prop="status" :label="$t('G2_FIELD_STATUS', '状态')" width="100">
        <template #default="{ row }">
          <DictText :value="row.status" usage-code="ENABLE_STATUS" />
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" :label="$t('G2_LBL_SORT', '排序')" width="100" />
      <el-table-column prop="remark" :label="$t('G2_FIELD_DESCRIPTION', '说明')" min-width="160" show-overflow-tooltip />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="220">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'knowledge_tag:edit'" link size="small" @click="handleEdit(row)">
            {{ $t('G2_BTN_EDIT', '编辑') }}
          </el-button>
          <el-button type="danger" v-permission="'knowledge_tag:delete'" link size="small" @click="handleDelete(row)">
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

    <div class="knowledge_tag-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="isEdit ? $t('G2_BTN_EDIT_TAG', '编辑标签') : $t('G2_BTN_ADD_TAG', '新增标签')" width="520px" destroy-on-close>
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="88px">
        <el-form-item :label="$t('G2_FIELD_CODE', '编码')" prop="tagCode">
          <el-input v-model="editForm.tagCode" :placeholder="$t('G2_PH_CODE', '请输入编码')" :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_NAME', '名称')" prop="tagName">
          <el-input v-model="editForm.tagName" :placeholder="$t('G2_PH_NAME', '请输入名称')" />
        </el-form-item>
        <el-form-item :label="$t('G2_LBL_SORT', '排序')" prop="sortOrder">
          <el-input-number v-model="editForm.sortOrder" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_STATUS', '状态')" prop="status">
          <DictSelect v-model="editForm.status" usage-code="ENABLE_STATUS" :placeholder="$t('G2_PH_STATUS', '请选择状态')" width="100%" />
        </el-form-item>
        <el-form-item :label="$t('G2_FIELD_DESCRIPTION', '说明')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :rows="3" :placeholder="$t('G2_FIELD_DESCRIPTION', '说明')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">{{ $t('G2_BTN_CANCEL', '取消') }}</el-button>
        <el-button type="primary" @click="submitEdit">{{ $t('G2_BTN_SAVE', '保存') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" :title="$t('G2_DETAIL_TAG', '标签明细')" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_ORGAN', '所属机构')">{{ organName(currentRow) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_CODE', '编码')">{{ currentRow?.tagCode }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_NAME', '名称')">{{ currentRow?.tagName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_STATUS', '状态')">
          <DictText :value="currentRow?.status" usage-code="ENABLE_STATUS" />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('G2_LBL_SORT', '排序')">{{ currentRow?.sortOrder }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_DESCRIPTION', '说明')">{{ currentRow?.remark }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">{{ $t('G2_BTN_CLOSE', '关闭') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { t } from '@platform/i18n';
import { KnowledgeTagApi } from './api';
import type { KnowledgeTag, KnowledgeTagPayload, KnowledgeTagQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import { SortableTable, TableColumn, SortManagerButton, QueryForm } from '@g2rain/ui';
import { OrganSelect, DictSelect, DictText } from '@g2rain/ui/platform';
import { compactQuery } from '@shared/knowledge/entity';
import { ensureOrganNames, organName } from '@shared/knowledge/organ-name';

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);
const baseQueryForm = ref<BaseSelectListDto>({});
const queryForm = reactive({
  organId: undefined as number | null | undefined,
  tagCode: '',
  tagName: '',
  status: '',
});
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 });
const tableData = ref<KnowledgeTag[]>([]);

const loadData = async () => {
  try {
    const query = compactQuery({ ...baseQueryForm.value, ...queryForm }) as KnowledgeTagQuery;
    const pageData = await KnowledgeTagApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeTagQuery);
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
  queryForm.tagCode = '';
  queryForm.tagName = '';
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

const currentRow = ref<KnowledgeTag | null>(null);
const detailDialogVisible = ref(false);
const handleView = (row: KnowledgeTag) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: KnowledgeTag) => {
  ElMessageBox.confirm(t('KN_TAG_DEL_CONFIRM', { name: row.tagName }, '确认删除标签「{name}」吗？'), t('G2_LBL_TIP', '提示'), { type: 'warning' })
    .then(async () => {
      await KnowledgeTagApi.remove(row.id);
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
  tagCode: '',
  tagName: '',
  status: 'ACTIVE',
  sortOrder: 0 as number | undefined,
  remark: '',
});
const editRules: FormRules = {
  tagCode: [{ required: true, message: t('G2_PH_CODE', '请输入编码'), trigger: 'blur' }],
  tagName: [{ required: true, message: t('G2_PH_NAME', '请输入名称'), trigger: 'blur' }],
  status: [{ required: true, message: t('G2_PH_STATUS', '请选择状态'), trigger: 'change' }],
  sortOrder: [{ required: true, message: t('G2_LBL_SORT', '排序'), trigger: 'blur' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  Object.assign(editForm, { id: undefined, tagCode: '', tagName: '', status: 'ACTIVE', sortOrder: 0, remark: '' });
  editDialogVisible.value = true;
};

const handleEdit = (row: KnowledgeTag) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  Object.assign(editForm, {
    id: row.id,
    tagCode: row.tagCode,
    tagName: row.tagName,
    status: row.status,
    sortOrder: row.sortOrder,
    remark: row.remark,
  });
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate().catch(() => false);
  if (!valid) return;
  const payload: KnowledgeTagPayload = {
    tagCode: editForm.tagCode,
    tagName: editForm.tagName,
    status: editForm.status,
    sortOrder: editForm.sortOrder,
    remark: editForm.remark,
  };
  if (isEdit.value) payload.id = editForm.id;
  await KnowledgeTagApi.save(payload);
  ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
  await loadData();
  editDialogVisible.value = false;
};

onMounted(() => loadData());
</script>

<style scoped>
.knowledge_tag-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}
.knowledge_tag-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_tag-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_tag-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_tag-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
