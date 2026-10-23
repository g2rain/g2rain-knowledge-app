<template>
  <div class="knowledge_category-page">
    <el-card class="knowledge_category-page__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item label="所属机构">
          <OrganSelect v-model="queryForm.organId" />
        </el-form-item>
        <el-form-item label="分类编码">
          <el-input v-model="queryForm.categoryCode" placeholder="分类编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="queryForm.categoryName" placeholder="分类名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="状态" clearable style="width: 160px">
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

    <div class="knowledge_category-page__header">
      <div class="knowledge_category-page__title-group">
        <h2>分类管理</h2>
      </div>
      <el-button type="primary" v-permission="'knowledge_category:add'" @click="handleCreate">新增分类</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column label="机构名称" min-width="140" show-overflow-tooltip>
        <template #default="{ row }">{{ organName(row) }}</template>
      </el-table-column>
      <el-table-column prop="categoryCode" label="编码" min-width="140" />
      <el-table-column prop="categoryName" label="名称" min-width="160" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">{{ statusLabel(row.status) }}</template>
      </el-table-column>
      <el-table-column prop="sortOrder" label="排序" width="100" />
      <el-table-column prop="remark" label="说明" min-width="160" show-overflow-tooltip />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="220">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'knowledge_category:edit'" link size="small" @click="handleEdit(row)">
            {{ $t('G2_BTN_EDIT', '编辑') }}
          </el-button>
          <el-button type="danger" v-permission="'knowledge_category:delete'" link size="small" @click="handleDelete(row)">
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

    <div class="knowledge_category-page__pagination">
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

    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑分类' : '新增分类'" width="520px" destroy-on-close>
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="88px">
        <el-form-item label="编码" prop="categoryCode">
          <el-input v-model="editForm.categoryCode" placeholder="分类编码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="名称" prop="categoryName">
          <el-input v-model="editForm.categoryName" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="editForm.sortOrder" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="状态" style="width: 100%">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :rows="3" placeholder="说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">{{ $t('G2_BTN_CANCEL', '取消') }}</el-button>
        <el-button type="primary" @click="submitEdit">{{ $t('G2_BTN_SAVE', '保存') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="分类明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="机构名称">{{ organName(currentRow) }}</el-descriptions-item>
        <el-descriptions-item label="编码">{{ currentRow?.categoryCode }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ currentRow?.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusLabel(currentRow?.status) }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ currentRow?.sortOrder }}</el-descriptions-item>
        <el-descriptions-item label="说明">{{ currentRow?.remark }}</el-descriptions-item>
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
import { KnowledgeCategoryApi } from './api';
import type { KnowledgeCategory, KnowledgeCategoryPayload, KnowledgeCategoryQuery } from './type';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import { SortableTable, TableColumn, SortManagerButton, QueryForm } from '@g2rain/ui';
import { OrganSelect } from '@g2rain/ui/platform';
import { showErrorMessage } from '@/components';
import { compactQuery } from '@shared/knowledge/entity';
import { ensureOrganNames, organName } from '@shared/knowledge/organ-name';
import { ITEM_STATUS_OPTIONS } from '@/views/knowledge_revision/status';

const statusOptions = ITEM_STATUS_OPTIONS;
const statusLabel = (status?: string) => statusOptions.find((o) => o.value === status)?.label || status || '-';

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);
const baseQueryForm = ref<BaseSelectListDto>({});
const queryForm = reactive({
  organId: undefined as number | null | undefined,
  categoryCode: '',
  categoryName: '',
  status: '',
});
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 });
const tableData = ref<KnowledgeCategory[]>([]);

const loadData = async () => {
  try {
    const query = compactQuery({ ...baseQueryForm.value, ...queryForm }) as KnowledgeCategoryQuery;
    const pageData = await KnowledgeCategoryApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeCategoryQuery);
    tableData.value = pageData.records;
    pagination.total = pageData.total;
    await ensureOrganNames(pageData.records);
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
  queryForm.organId = undefined;
  queryForm.categoryCode = '';
  queryForm.categoryName = '';
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

const currentRow = ref<KnowledgeCategory | null>(null);
const detailDialogVisible = ref(false);
const handleView = (row: KnowledgeCategory) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

const handleDelete = (row: KnowledgeCategory) => {
  ElMessageBox.confirm(`确认删除分类「${row.categoryName}」吗？`, t('G2_LBL_TIP', '提示'), { type: 'warning' })
    .then(async () => {
      try {
        await KnowledgeCategoryApi.remove(row.id);
        if (tableData.value.length === 1 && pagination.pageNum > 1) pagination.pageNum--;
        await loadData();
        ElMessage.success(t('G2_MSG_DELETE_OK', '删除成功'));
      } catch (error: unknown) {
        showErrorMessage(error instanceof Error ? error.message : t('G2_MSG_DELETE_FAIL', '删除失败'));
      }
    })
    .catch(() => {});
};

const editDialogVisible = ref(false);
const isEdit = ref(false);
const editFormRef = ref<FormInstance | null>(null);
const editForm = reactive({
  id: undefined as number | undefined,
  categoryCode: '',
  categoryName: '',
  status: 'ACTIVE',
  sortOrder: 0 as number | undefined,
  remark: '',
});
const editRules: FormRules = {
  categoryCode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  sortOrder: [{ required: true, message: '请输入排序', trigger: 'blur' }],
};

const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();
  editForm.id = undefined;
  editForm.categoryCode = '';
  editForm.categoryName = '';
  editForm.status = 'ACTIVE';
  editForm.sortOrder = 0;
  editForm.remark = '';
  editDialogVisible.value = true;
};

const handleEdit = (row: KnowledgeCategory) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();
  editForm.id = row.id;
  editForm.categoryCode = row.categoryCode;
  editForm.categoryName = row.categoryName;
  editForm.status = row.status;
  editForm.sortOrder = row.sortOrder;
  editForm.remark = row.remark;
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate().catch(() => false);
  if (!valid) return;
  const payload: KnowledgeCategoryPayload = {
    categoryCode: editForm.categoryCode,
    categoryName: editForm.categoryName,
    status: editForm.status,
    sortOrder: editForm.sortOrder,
    remark: editForm.remark,
  };
  if (isEdit.value) payload.id = editForm.id;
  try {
    await KnowledgeCategoryApi.save(payload);
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    await loadData();
    editDialogVisible.value = false;
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : t('G2_MSG_SAVE_FAIL', '保存失败'));
  }
};

onMounted(() => loadData());
</script>

<style scoped>
.knowledge_category-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}
.knowledge_category-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_category-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.knowledge_category-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_category-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_category-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
