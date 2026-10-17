
<template>
  <div class="knowledge_task-page">
    <!-- 查询表单 -->
    <el-card class="knowledge_task-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="机构ID">
          <el-input v-model="queryForm.organId" placeholder="请输入机构ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="知识版本ID">
          <el-input v-model="queryForm.revisionId" placeholder="请输入知识版本ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="知识处理任务类型；不承载发布、回滚或下线">
          <el-input v-model="queryForm.taskType" placeholder="请输入知识处理任务类型；不承载发布、回滚或下线" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-input v-model="queryForm.taskStatus" placeholder="请输入任务状态" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="幂等键">
          <el-input v-model="queryForm.idempotencyKey" placeholder="请输入幂等键" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="不可变处理输入快照，不含正文或凭据">
          <el-input v-model="queryForm.inputSnapshot" placeholder="请输入不可变处理输入快照，不含正文或凭据" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="尝试次数">
          <el-input v-model="queryForm.attemptNo" placeholder="请输入尝试次数" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="任务可被领取时间，用于处理任务延迟重试">
          <el-input v-model="queryForm.availableTime" placeholder="请输入任务可被领取时间，用于处理任务延迟重试" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="当前任务工作者ID">
          <el-input v-model="queryForm.leaseOwner" placeholder="请输入当前任务工作者ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="任务领取租约到期时间">
          <el-input v-model="queryForm.leaseExpireTime" placeholder="请输入任务领取租约到期时间" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="任务租约 fencing 代次">
          <el-input v-model="queryForm.leaseGeneration" placeholder="请输入任务租约 fencing 代次" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="运行中任务协作取消ID">
          <el-input v-model="queryForm.cancelRequested" placeholder="请输入运行中任务协作取消ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="外部提供方名称">
          <el-input v-model="queryForm.providerName" placeholder="请输入外部提供方名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="模型ID">
          <el-input v-model="queryForm.modelName" placeholder="请输入模型ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="调用链ID">
          <el-input v-model="queryForm.traceId" placeholder="请输入调用链ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="queryForm.startedTime" placeholder="请输入开始时间" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="完成时间">
          <el-input v-model="queryForm.finishedTime" placeholder="请输入完成时间" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="安全错误码">
          <el-input v-model="queryForm.errorCode" placeholder="请输入安全错误码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="净化后的错误摘要，不得含原文或Secret">
          <el-input v-model="queryForm.errorSummary" placeholder="请输入净化后的错误摘要，不得含原文或Secret" clearable style="width: 200px" />
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
    <div class="knowledge_task-page__header">
      <div class="knowledge_task-page__title-group">
        <h2>管理知识解析与索引处理任务表数据</h2>
      </div>
      <el-button type="primary" v-permission="'knowledge_task:add'" @click="handleCreate">新增知识解析与索引处理任务表</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('G2_FIELD_ID', 'ID')" width="120" />
      <el-table-column prop="organId" label="机构ID" width="140" />
      <el-table-column prop="revisionId" label="知识版本ID" width="140" />
      <el-table-column prop="taskType" label="知识处理任务类型；不承载发布、回滚或下线" width="180" />
      <el-table-column prop="taskStatus" label="任务状态" width="180" />
      <el-table-column prop="idempotencyKey" label="幂等键" width="180" />
      <el-table-column prop="inputSnapshot" label="不可变处理输入快照，不含正文或凭据" width="180" />
      <el-table-column prop="attemptNo" label="尝试次数" width="140" />
      <el-table-column prop="availableTime" label="任务可被领取时间，用于处理任务延迟重试" width="180" />
      <el-table-column prop="leaseOwner" label="当前任务工作者ID" width="180" />
      <el-table-column prop="leaseExpireTime" label="任务领取租约到期时间" width="180" />
      <el-table-column prop="leaseGeneration" label="任务租约 fencing 代次" width="140" />
      <el-table-column prop="cancelRequested" label="运行中任务协作取消ID" width="140" />
      <el-table-column prop="providerName" label="外部提供方名称" width="180" />
      <el-table-column prop="modelName" label="模型ID" width="180" />
      <el-table-column prop="traceId" label="调用链ID" width="180" />
      <el-table-column prop="startedTime" label="开始时间" width="180" />
      <el-table-column prop="finishedTime" label="完成时间" width="180" />
      <el-table-column prop="errorCode" label="安全错误码" width="180" />
      <el-table-column prop="errorSummary" label="净化后的错误摘要，不得含原文或Secret" width="180" />
      <TableColumn prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" sortable="custom" />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'knowledge_task:edit'" link size="small" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" v-permission="'knowledge_task:delete'" link size="small" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
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
    <div class="knowledge_task-page__pagination">
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
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑知识解析与索引处理任务表' : '新增知识解析与索引处理任务表'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="机构ID" prop="organId">
          <el-input v-model="editForm.organId" placeholder="请输入机构ID" />
        </el-form-item>
        <el-form-item label="知识版本ID" prop="revisionId">
          <el-input v-model="editForm.revisionId" placeholder="请输入知识版本ID" />
        </el-form-item>
        <el-form-item label="知识处理任务类型；不承载发布、回滚或下线" prop="taskType">
          <el-input v-model="editForm.taskType" placeholder="请输入知识处理任务类型；不承载发布、回滚或下线" />
        </el-form-item>
        <el-form-item label="任务状态" prop="taskStatus">
          <el-input v-model="editForm.taskStatus" placeholder="请输入任务状态" />
        </el-form-item>
        <el-form-item label="幂等键" prop="idempotencyKey">
          <el-input v-model="editForm.idempotencyKey" placeholder="请输入幂等键" />
        </el-form-item>
        <el-form-item label="不可变处理输入快照，不含正文或凭据" prop="inputSnapshot">
          <el-input v-model="editForm.inputSnapshot" placeholder="请输入不可变处理输入快照，不含正文或凭据" />
        </el-form-item>
        <el-form-item label="尝试次数" prop="attemptNo">
          <el-input v-model="editForm.attemptNo" placeholder="请输入尝试次数" />
        </el-form-item>
        <el-form-item label="任务可被领取时间，用于处理任务延迟重试" prop="availableTime">
          <el-input v-model="editForm.availableTime" placeholder="请输入任务可被领取时间，用于处理任务延迟重试" />
        </el-form-item>
        <el-form-item label="当前任务工作者ID" prop="leaseOwner">
          <el-input v-model="editForm.leaseOwner" placeholder="请输入当前任务工作者ID" />
        </el-form-item>
        <el-form-item label="任务领取租约到期时间" prop="leaseExpireTime">
          <el-input v-model="editForm.leaseExpireTime" placeholder="请输入任务领取租约到期时间" />
        </el-form-item>
        <el-form-item label="任务租约 fencing 代次" prop="leaseGeneration">
          <el-input v-model="editForm.leaseGeneration" placeholder="请输入任务租约 fencing 代次" />
        </el-form-item>
        <el-form-item label="运行中任务协作取消ID" prop="cancelRequested">
          <el-input v-model="editForm.cancelRequested" placeholder="请输入运行中任务协作取消ID" />
        </el-form-item>
        <el-form-item label="外部提供方名称" prop="providerName">
          <el-input v-model="editForm.providerName" placeholder="请输入外部提供方名称" />
        </el-form-item>
        <el-form-item label="模型ID" prop="modelName">
          <el-input v-model="editForm.modelName" placeholder="请输入模型ID" />
        </el-form-item>
        <el-form-item label="调用链ID" prop="traceId">
          <el-input v-model="editForm.traceId" placeholder="请输入调用链ID" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startedTime">
          <el-input v-model="editForm.startedTime" placeholder="请输入开始时间" />
        </el-form-item>
        <el-form-item label="完成时间" prop="finishedTime">
          <el-input v-model="editForm.finishedTime" placeholder="请输入完成时间" />
        </el-form-item>
        <el-form-item label="安全错误码" prop="errorCode">
          <el-input v-model="editForm.errorCode" placeholder="请输入安全错误码" />
        </el-form-item>
        <el-form-item label="净化后的错误摘要，不得含原文或Secret" prop="errorSummary">
          <el-input v-model="editForm.errorSummary" placeholder="请输入净化后的错误摘要，不得含原文或Secret" />
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
    <el-dialog v-model="detailDialogVisible" title="知识解析与索引处理任务表明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_ID', 'ID')">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="机构ID">{{ currentRow?.organId }}</el-descriptions-item>
        <el-descriptions-item label="知识版本ID">{{ currentRow?.revisionId }}</el-descriptions-item>
        <el-descriptions-item label="知识处理任务类型；不承载发布、回滚或下线">{{ currentRow?.taskType }}</el-descriptions-item>
        <el-descriptions-item label="任务状态">{{ currentRow?.taskStatus }}</el-descriptions-item>
        <el-descriptions-item label="幂等键">{{ currentRow?.idempotencyKey }}</el-descriptions-item>
        <el-descriptions-item label="不可变处理输入快照，不含正文或凭据">{{ currentRow?.inputSnapshot }}</el-descriptions-item>
        <el-descriptions-item label="尝试次数">{{ currentRow?.attemptNo }}</el-descriptions-item>
        <el-descriptions-item label="任务可被领取时间，用于处理任务延迟重试">{{ currentRow?.availableTime }}</el-descriptions-item>
        <el-descriptions-item label="当前任务工作者ID">{{ currentRow?.leaseOwner }}</el-descriptions-item>
        <el-descriptions-item label="任务领取租约到期时间">{{ currentRow?.leaseExpireTime }}</el-descriptions-item>
        <el-descriptions-item label="任务租约 fencing 代次">{{ currentRow?.leaseGeneration }}</el-descriptions-item>
        <el-descriptions-item label="运行中任务协作取消ID">{{ currentRow?.cancelRequested }}</el-descriptions-item>
        <el-descriptions-item label="外部提供方名称">{{ currentRow?.providerName }}</el-descriptions-item>
        <el-descriptions-item label="模型ID">{{ currentRow?.modelName }}</el-descriptions-item>
        <el-descriptions-item label="调用链ID">{{ currentRow?.traceId }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentRow?.startedTime }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ currentRow?.finishedTime }}</el-descriptions-item>
        <el-descriptions-item label="安全错误码">{{ currentRow?.errorCode }}</el-descriptions-item>
        <el-descriptions-item label="净化后的错误摘要，不得含原文或Secret">{{ currentRow?.errorSummary }}</el-descriptions-item>
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
import { KnowledgeTaskApi } from './api';
import type { KnowledgeTask, KnowledgeTaskPayload, KnowledgeTaskQuery } from './type';
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
  taskType: '',
  taskStatus: '',
  idempotencyKey: '',
  inputSnapshot: '',
  attemptNo: undefined,
  availableTime: '',
  leaseOwner: '',
  leaseExpireTime: '',
  leaseGeneration: undefined,
  cancelRequested: undefined,
  providerName: '',
  modelName: '',
  traceId: '',
  startedTime: '',
  finishedTime: '',
  errorCode: '',
  errorSummary: '',
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 定义列表引用
const tableData = ref<KnowledgeTask[]>([]);

// 加载列表数据
const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm.value, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as KnowledgeTaskQuery;

    // 请求分页数据
    const pageData = await KnowledgeTaskApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeTaskQuery);

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
  queryForm.taskType = '';
  queryForm.taskStatus = '';
  queryForm.idempotencyKey = '';
  queryForm.inputSnapshot = '';
  queryForm.attemptNo = undefined;
  queryForm.availableTime = '';
  queryForm.leaseOwner = '';
  queryForm.leaseExpireTime = '';
  queryForm.leaseGeneration = undefined;
  queryForm.cancelRequested = undefined;
  queryForm.providerName = '';
  queryForm.modelName = '';
  queryForm.traceId = '';
  queryForm.startedTime = '';
  queryForm.finishedTime = '';
  queryForm.errorCode = '';
  queryForm.errorSummary = '';

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
const currentRow = ref<KnowledgeTask | null>(null);
// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: KnowledgeTask) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: KnowledgeTask) => {
  ElMessageBox.confirm(`确认删除知识解析与索引处理任务表「${row.id}」吗？`, t('G2_LBL_TIP', '提示'), {
    type: 'warning',
  })
    .then(async () => {
      try {
        await KnowledgeTaskApi.remove(row.id);
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
  taskType: '',
  taskStatus: '',
  idempotencyKey: '',
  inputSnapshot: '',
  attemptNo: undefined as number | undefined,
  availableTime: '',
  leaseOwner: '',
  leaseExpireTime: '',
  leaseGeneration: undefined as number | undefined,
  cancelRequested: undefined as number | undefined,
  providerName: '',
  modelName: '',
  traceId: '',
  startedTime: '',
  finishedTime: '',
  errorCode: '',
  errorSummary: '',
});

// 表单校验规则
const editRules: FormRules = {
  organId: [{ required: true, message: '请输入机构标识', trigger: 'blur' }],
  revisionId: [{ required: true, message: '请输入知识版本标识', trigger: 'blur' }],
  taskType: [{ required: true, message: '请输入知识处理任务类型[PARSE,INDEX,DELETE_INDEX]；不承载发布、回滚或下线', trigger: 'blur' }],
  taskStatus: [{ required: true, message: '请输入任务状态[PENDING,RUNNING,SUCCESS,FAILED,CANCELED]', trigger: 'blur' }],
  idempotencyKey: [{ required: true, message: '请输入幂等键', trigger: 'blur' }],
  attemptNo: [{ required: true, message: '请输入尝试次数', trigger: 'blur' }],
  availableTime: [{ required: true, message: '请输入任务可被领取时间，用于处理任务延迟重试', trigger: 'blur' }],
  leaseGeneration: [{ required: true, message: '请输入任务租约 fencing 代次', trigger: 'blur' }],
  cancelRequested: [{ required: true, message: '请输入运行中任务协作取消标识', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.organId = undefined;
  editForm.revisionId = undefined;
  editForm.taskType = '';
  editForm.taskStatus = '';
  editForm.idempotencyKey = '';
  editForm.inputSnapshot = '';
  editForm.attemptNo = undefined;
  editForm.availableTime = '';
  editForm.leaseOwner = '';
  editForm.leaseExpireTime = '';
  editForm.leaseGeneration = undefined;
  editForm.cancelRequested = undefined;
  editForm.providerName = '';
  editForm.modelName = '';
  editForm.traceId = '';
  editForm.startedTime = '';
  editForm.finishedTime = '';
  editForm.errorCode = '';
  editForm.errorSummary = '';
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: KnowledgeTask) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.revisionId = row.revisionId;
  editForm.taskType = row.taskType;
  editForm.taskStatus = row.taskStatus;
  editForm.idempotencyKey = row.idempotencyKey;
  editForm.inputSnapshot = row.inputSnapshot;
  editForm.attemptNo = row.attemptNo;
  editForm.availableTime = row.availableTime;
  editForm.leaseOwner = row.leaseOwner;
  editForm.leaseExpireTime = row.leaseExpireTime;
  editForm.leaseGeneration = row.leaseGeneration;
  editForm.cancelRequested = row.cancelRequested;
  editForm.providerName = row.providerName;
  editForm.modelName = row.modelName;
  editForm.traceId = row.traceId;
  editForm.startedTime = row.startedTime;
  editForm.finishedTime = row.finishedTime;
  editForm.errorCode = row.errorCode;
  editForm.errorSummary = row.errorSummary;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: KnowledgeTaskPayload = {
    organId: editForm.organId,
    revisionId: editForm.revisionId,
    taskType: editForm.taskType,
    taskStatus: editForm.taskStatus,
    idempotencyKey: editForm.idempotencyKey,
    inputSnapshot: editForm.inputSnapshot,
    attemptNo: editForm.attemptNo,
    availableTime: editForm.availableTime,
    leaseOwner: editForm.leaseOwner,
    leaseExpireTime: editForm.leaseExpireTime,
    leaseGeneration: editForm.leaseGeneration,
    cancelRequested: editForm.cancelRequested,
    providerName: editForm.providerName,
    modelName: editForm.modelName,
    traceId: editForm.traceId,
    startedTime: editForm.startedTime,
    finishedTime: editForm.finishedTime,
    errorCode: editForm.errorCode,
    errorSummary: editForm.errorSummary,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await KnowledgeTaskApi.save(payload);
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
.knowledge_task-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.knowledge_task-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}

.knowledge_task-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.knowledge_task-page__header h2 {
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

.knowledge_task-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}

.knowledge_task-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
