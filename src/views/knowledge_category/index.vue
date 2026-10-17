
<template>
  <div class="knowledge_category-page">
    <!-- 查询表单 -->
    <el-card class="knowledge_category-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="机构ID">
          <el-input v-model="queryForm.organId" placeholder="请输入机构ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类编码">
          <el-input v-model="queryForm.categoryCode" placeholder="请输入分类编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="queryForm.categoryName" placeholder="请输入分类名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="queryForm.status" placeholder="请输入状态" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="queryForm.sortOrder" placeholder="请输入排序" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="queryForm.remark" placeholder="请输入备注" clearable style="width: 200px" />
        </el-form-item>

        <!-- 操作按钮 -->
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
            <el-button @click="handleReset">{{ $t('G2_BTN_RESET', '重置') }}</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <!-- 标题和操作按钮 -->
    <div class="knowledge_category-page__header">
      <div class="knowledge_category-page__title-group">
        <h2>管理知识分类表数据</h2>
      </div>
      <el-button type="primary" v-permission="'knowledge_category:add'" @click="handleCreate">新增知识分类表</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('G2_FIELD_ID', 'ID')" width="120" />
      <el-table-column prop="organId" label="机构ID" width="140" />
      <el-table-column prop="categoryCode" label="分类编码" width="180" />
      <el-table-column prop="categoryName" label="分类名称" width="180" />
      <el-table-column prop="status" label="状态" width="180" />
      <el-table-column prop="sortOrder" label="排序" width="140" />
      <el-table-column prop="remark" label="备注" width="180" />
      <TableColumn prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" sortable="custom" />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'knowledge_category:edit'" link size="small" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" v-permission="'knowledge_category:delete'" link size="small" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
        </template>
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>{{ $t('G2_FIELD_ACTION', '操作') }}</span>
            <SortManagerButton />
          </div>
        </template>
      </el-table-column>
    </SortableTable>

    <!-- 分页组件 -->
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

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑知识分类表' : '新增知识分类表'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="机构ID" prop="organId">
          <el-input v-model="editForm.organId" placeholder="请输入机构ID" />
        </el-form-item>
        <el-form-item label="分类编码" prop="categoryCode">
          <el-input v-model="editForm.categoryCode" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="editForm.categoryName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="editForm.status" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input v-model="editForm.sortOrder" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">{{ $t('G2_BTN_CANCEL', '取消') }}</el-button>
          <el-button type="primary" @click="submitEdit">{{ $t('G2_BTN_SAVE', '保存') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 明细弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="知识分类表明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_ID', 'ID')">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="机构ID">{{ currentRow?.organId }}</el-descriptions-item>
        <el-descriptions-item label="分类编码">{{ currentRow?.categoryCode }}</el-descriptions-item>
        <el-descriptions-item label="分类名称">{{ currentRow?.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ currentRow?.status }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ currentRow?.sortOrder }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow?.remark }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_CREATE_TIME', '创建时间')">{{ currentRow?.createTime }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')">{{ currentRow?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">{{ $t('G2_BTN_CLOSE', '关闭') }}</el-button>
        </span>
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
import { showErrorMessage } from '@/components';


// 组件引用
const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);

// 基础查询表单（BaseSelectListDto）；用 ref 以匹配 QueryForm defineModel
const baseQueryForm = ref<BaseSelectListDto>({
  id: undefined,
  createTime: undefined,
  updateTime: undefined,
  sorts: undefined,
});

// 业务查询状态
const queryForm = reactive({
  organId: undefined,
  categoryCode: '',
  categoryName: '',
  status: '',
  sortOrder: undefined,
  remark: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 定义列表引用
const tableData = ref<KnowledgeCategory[]>([]);

// 加载列表数据
const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm.value, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as KnowledgeCategoryQuery;

    // 请求分页数据
    const pageData = await KnowledgeCategoryApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeCategoryQuery);

    // 设置响应结果
    tableData.value = pageData.records;
    pagination.total = pageData.total;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : t('G2_MSG_LOAD_FAIL', '加载列表失败');
    showErrorMessage(msg);
  }
};

// 处理排序变化
const handleSortChange = (params: Record<string, string>) => {
  // 更新 QueryForm 的 sorts 字段
  queryFormRef.value?.updateSorts(params);
};

// 查询
const handleSearch = () => {
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 重置查询条件
const handleReset = () => {
  // 重置基础查询表单
  baseQueryForm.value.id = undefined;
  baseQueryForm.value.createTime = undefined;
  baseQueryForm.value.updateTime = undefined;
  baseQueryForm.value.sorts = undefined;
  // 重置业务特定查询表单
  queryForm.organId = undefined;
  queryForm.categoryCode = '';
  queryForm.categoryName = '';
  queryForm.status = '';
  queryForm.sortOrder = undefined;
  queryForm.remark = '';

  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1; // 重置到第一页
  loadData();
};

// 页码变化
const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  loadData();
};

// 当前记录引用
const currentRow = ref<KnowledgeCategory | null>(null);
// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: KnowledgeCategory) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: KnowledgeCategory) => {
  ElMessageBox.confirm(`确认删除知识分类表「${row.id}」吗？`, t('G2_LBL_TIP', '提示'), {
    type: 'warning',
  })
    .then(async () => {
      try {
        await KnowledgeCategoryApi.remove(row.id);
        // 如果当前页只有一条数据，删除后应该跳转到上一页
        if (tableData.value.length === 1 && pagination.pageNum > 1) {
          pagination.pageNum--;
        }
        await loadData();
        ElMessage.success(t('G2_MSG_DELETE_OK', '删除成功'));
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : t('G2_MSG_DELETE_FAIL', '删除失败');
        showErrorMessage(msg);
      }
    })
    .catch(() => {});
};

// 保存弹窗引用
const editDialogVisible = ref(false);

// 修改标记状态
const isEdit = ref(false);

// 修改组件引用
const editFormRef = ref<FormInstance | null>(null);

// 保存表单状态
const editForm = reactive({
  id: undefined as number | undefined,
  organId: undefined as number | undefined,
  categoryCode: '',
  categoryName: '',
  status: '',
  sortOrder: undefined as number | undefined,
  remark: '',
});

// 表单校验规则
const editRules: FormRules = {
  organId: [{ required: true, message: '请输入机构标识', trigger: 'blur' }],
  categoryCode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  status: [{ required: true, message: '请输入状态[ACTIVE:有效, INACTIVE:停用]', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.organId = undefined;
  editForm.categoryCode = '';
  editForm.categoryName = '';
  editForm.status = '';
  editForm.sortOrder = undefined;
  editForm.remark = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: KnowledgeCategory) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.categoryCode = row.categoryCode;
  editForm.categoryName = row.categoryName;
  editForm.status = row.status;
  editForm.sortOrder = row.sortOrder;
  editForm.remark = row.remark;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: KnowledgeCategoryPayload = {
    organId: editForm.organId,
    categoryCode: editForm.categoryCode,
    categoryName: editForm.categoryName,
    status: editForm.status,
    sortOrder: editForm.sortOrder,
    remark: editForm.remark,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await KnowledgeCategoryApi.save(payload);
    ElMessage.success(isEdit.value ? t('G2_MSG_UPDATE_OK', '更新成功') : t('G2_MSG_ADD_OK', '新增成功'));
    await loadData();
    editDialogVisible.value = false;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : t('G2_MSG_SAVE_FAIL', '保存失败');
    showErrorMessage(msg);
  }
};

// 挂载回调
onMounted(() => {
  // 查询列表
  loadData();
});
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
  margin-top: 0;
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
  line-height: 1.4;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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
