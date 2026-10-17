
<template>
  <div class="knowledge_chunk-page">
    <!-- 查询表单 -->
    <el-card class="knowledge_chunk-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="机构ID">
          <el-input v-model="queryForm.organId" placeholder="请输入机构ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="知识版本ID">
          <el-input v-model="queryForm.revisionId" placeholder="请输入知识版本ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="版本内切片序号，从1开始">
          <el-input v-model="queryForm.chunkNo" placeholder="请输入版本内切片序号，从1开始" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="父级切片序号">
          <el-input v-model="queryForm.parentChunkNo" placeholder="请输入父级切片序号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="解析产物内的受控定位符">
          <el-input v-model="queryForm.sourceLocator" placeholder="请输入解析产物内的受控定位符" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="标题层级路径，不保存完整正文">
          <el-input v-model="queryForm.titlePath" placeholder="请输入标题层级路径，不保存完整正文" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="起始页码">
          <el-input v-model="queryForm.pageStart" placeholder="请输入起始页码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="结束页码">
          <el-input v-model="queryForm.pageEnd" placeholder="请输入结束页码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="切片token数量">
          <el-input v-model="queryForm.tokenCount" placeholder="请输入切片token数量" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="切片正文SHA-256">
          <el-input v-model="queryForm.contentSha256" placeholder="请输入切片正文SHA-256" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="切片状态">
          <el-input v-model="queryForm.chunkStatus" placeholder="请输入切片状态" clearable style="width: 200px" />
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
    <div class="knowledge_chunk-page__header">
      <div class="knowledge_chunk-page__title-group">
        <h2>管理知识切片清单表数据</h2>
      </div>
      <el-button type="primary" v-permission="'knowledge_chunk:add'" @click="handleCreate">新增知识切片清单表</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('G2_FIELD_ID', 'ID')" width="120" />
      <el-table-column prop="organId" label="机构ID" width="140" />
      <el-table-column prop="revisionId" label="知识版本ID" width="140" />
      <el-table-column prop="chunkNo" label="版本内切片序号，从1开始" width="140" />
      <el-table-column prop="parentChunkNo" label="父级切片序号" width="140" />
      <el-table-column prop="sourceLocator" label="解析产物内的受控定位符" width="180" />
      <el-table-column prop="titlePath" label="标题层级路径，不保存完整正文" width="180" />
      <el-table-column prop="pageStart" label="起始页码" width="140" />
      <el-table-column prop="pageEnd" label="结束页码" width="140" />
      <el-table-column prop="tokenCount" label="切片token数量" width="140" />
      <el-table-column prop="contentSha256" label="切片正文SHA-256" width="180" />
      <el-table-column prop="chunkStatus" label="切片状态" width="180" />
      <TableColumn prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" sortable="custom" />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'knowledge_chunk:edit'" link size="small" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" v-permission="'knowledge_chunk:delete'" link size="small" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
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
    <div class="knowledge_chunk-page__pagination">
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
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑知识切片清单表' : '新增知识切片清单表'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="机构ID" prop="organId">
          <el-input v-model="editForm.organId" placeholder="请输入机构ID" />
        </el-form-item>
        <el-form-item label="知识版本ID" prop="revisionId">
          <el-input v-model="editForm.revisionId" placeholder="请输入知识版本ID" />
        </el-form-item>
        <el-form-item label="版本内切片序号，从1开始" prop="chunkNo">
          <el-input v-model="editForm.chunkNo" placeholder="请输入版本内切片序号，从1开始" />
        </el-form-item>
        <el-form-item label="父级切片序号" prop="parentChunkNo">
          <el-input v-model="editForm.parentChunkNo" placeholder="请输入父级切片序号" />
        </el-form-item>
        <el-form-item label="解析产物内的受控定位符" prop="sourceLocator">
          <el-input v-model="editForm.sourceLocator" placeholder="请输入解析产物内的受控定位符" />
        </el-form-item>
        <el-form-item label="标题层级路径，不保存完整正文" prop="titlePath">
          <el-input v-model="editForm.titlePath" placeholder="请输入标题层级路径，不保存完整正文" />
        </el-form-item>
        <el-form-item label="起始页码" prop="pageStart">
          <el-input v-model="editForm.pageStart" placeholder="请输入起始页码" />
        </el-form-item>
        <el-form-item label="结束页码" prop="pageEnd">
          <el-input v-model="editForm.pageEnd" placeholder="请输入结束页码" />
        </el-form-item>
        <el-form-item label="切片token数量" prop="tokenCount">
          <el-input v-model="editForm.tokenCount" placeholder="请输入切片token数量" />
        </el-form-item>
        <el-form-item label="切片正文SHA-256" prop="contentSha256">
          <el-input v-model="editForm.contentSha256" placeholder="请输入切片正文SHA-256" />
        </el-form-item>
        <el-form-item label="切片状态" prop="chunkStatus">
          <el-input v-model="editForm.chunkStatus" placeholder="请输入切片状态" />
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
    <el-dialog v-model="detailDialogVisible" title="知识切片清单表明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_ID', 'ID')">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="机构ID">{{ currentRow?.organId }}</el-descriptions-item>
        <el-descriptions-item label="知识版本ID">{{ currentRow?.revisionId }}</el-descriptions-item>
        <el-descriptions-item label="版本内切片序号，从1开始">{{ currentRow?.chunkNo }}</el-descriptions-item>
        <el-descriptions-item label="父级切片序号">{{ currentRow?.parentChunkNo }}</el-descriptions-item>
        <el-descriptions-item label="解析产物内的受控定位符">{{ currentRow?.sourceLocator }}</el-descriptions-item>
        <el-descriptions-item label="标题层级路径，不保存完整正文">{{ currentRow?.titlePath }}</el-descriptions-item>
        <el-descriptions-item label="起始页码">{{ currentRow?.pageStart }}</el-descriptions-item>
        <el-descriptions-item label="结束页码">{{ currentRow?.pageEnd }}</el-descriptions-item>
        <el-descriptions-item label="切片token数量">{{ currentRow?.tokenCount }}</el-descriptions-item>
        <el-descriptions-item label="切片正文SHA-256">{{ currentRow?.contentSha256 }}</el-descriptions-item>
        <el-descriptions-item label="切片状态">{{ currentRow?.chunkStatus }}</el-descriptions-item>
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
import { KnowledgeChunkApi } from './api';
import type { KnowledgeChunk, KnowledgeChunkPayload, KnowledgeChunkQuery } from './type';
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
  revisionId: undefined,
  chunkNo: undefined,
  parentChunkNo: undefined,
  sourceLocator: '',
  titlePath: '',
  pageStart: undefined,
  pageEnd: undefined,
  tokenCount: undefined,
  contentSha256: '',
  chunkStatus: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 定义列表引用
const tableData = ref<KnowledgeChunk[]>([]);

// 加载列表数据
const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm.value, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as KnowledgeChunkQuery;

    // 请求分页数据
    const pageData = await KnowledgeChunkApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeChunkQuery);

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
  queryForm.revisionId = undefined;
  queryForm.chunkNo = undefined;
  queryForm.parentChunkNo = undefined;
  queryForm.sourceLocator = '';
  queryForm.titlePath = '';
  queryForm.pageStart = undefined;
  queryForm.pageEnd = undefined;
  queryForm.tokenCount = undefined;
  queryForm.contentSha256 = '';
  queryForm.chunkStatus = '';

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
const currentRow = ref<KnowledgeChunk | null>(null);
// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: KnowledgeChunk) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: KnowledgeChunk) => {
  ElMessageBox.confirm(`确认删除知识切片清单表「${row.id}」吗？`, t('G2_LBL_TIP', '提示'), {
    type: 'warning',
  })
    .then(async () => {
      try {
        await KnowledgeChunkApi.remove(row.id);
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
  revisionId: undefined as number | undefined,
  chunkNo: undefined as number | undefined,
  parentChunkNo: undefined as number | undefined,
  sourceLocator: '',
  titlePath: '',
  pageStart: undefined as number | undefined,
  pageEnd: undefined as number | undefined,
  tokenCount: undefined as number | undefined,
  contentSha256: '',
  chunkStatus: '',
});

// 表单校验规则
const editRules: FormRules = {
  organId: [{ required: true, message: '请输入机构标识', trigger: 'blur' }],
  revisionId: [{ required: true, message: '请输入知识版本标识', trigger: 'blur' }],
  chunkNo: [{ required: true, message: '请输入版本内切片序号，从1开始', trigger: 'blur' }],
  sourceLocator: [{ required: true, message: '请输入解析产物内的受控定位符', trigger: 'blur' }],
  contentSha256: [{ required: true, message: '请输入切片正文SHA-256', trigger: 'blur' }],
  chunkStatus: [{ required: true, message: '请输入切片状态[PENDING,INDEXED,FAILED,DELETED]', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.organId = undefined;
  editForm.revisionId = undefined;
  editForm.chunkNo = undefined;
  editForm.parentChunkNo = undefined;
  editForm.sourceLocator = '';
  editForm.titlePath = '';
  editForm.pageStart = undefined;
  editForm.pageEnd = undefined;
  editForm.tokenCount = undefined;
  editForm.contentSha256 = '';
  editForm.chunkStatus = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: KnowledgeChunk) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.revisionId = row.revisionId;
  editForm.chunkNo = row.chunkNo;
  editForm.parentChunkNo = row.parentChunkNo;
  editForm.sourceLocator = row.sourceLocator;
  editForm.titlePath = row.titlePath;
  editForm.pageStart = row.pageStart;
  editForm.pageEnd = row.pageEnd;
  editForm.tokenCount = row.tokenCount;
  editForm.contentSha256 = row.contentSha256;
  editForm.chunkStatus = row.chunkStatus;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: KnowledgeChunkPayload = {
    organId: editForm.organId,
    revisionId: editForm.revisionId,
    chunkNo: editForm.chunkNo,
    parentChunkNo: editForm.parentChunkNo,
    sourceLocator: editForm.sourceLocator,
    titlePath: editForm.titlePath,
    pageStart: editForm.pageStart,
    pageEnd: editForm.pageEnd,
    tokenCount: editForm.tokenCount,
    contentSha256: editForm.contentSha256,
    chunkStatus: editForm.chunkStatus,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await KnowledgeChunkApi.save(payload);
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
.knowledge_chunk-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.knowledge_chunk-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}

.knowledge_chunk-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.knowledge_chunk-page__header h2 {
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

.knowledge_chunk-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}

.knowledge_chunk-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
