
<template>
  <div class="knowledge_revision-page">
    <!-- 查询表单 -->
    <el-card class="knowledge_revision-page__search" shadow="never">
      <!-- 基础查询表单（BaseSelectListDto） -->
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <!-- 业务特定查询字段 -->
        <el-form-item label="机构ID">
          <el-input v-model="queryForm.organId" placeholder="请输入机构ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="知识主题ID">
          <el-input v-model="queryForm.knowledgeId" placeholder="请输入知识主题ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="版本号，如 v3 或 2026.10.03">
          <el-input v-model="queryForm.revisionNo" placeholder="请输入版本号，如 v3 或 2026.10.03" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="来源类型">
          <el-input v-model="queryForm.sourceType" placeholder="请输入来源类型" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="版本状态">
          <el-input v-model="queryForm.revisionStatus" placeholder="请输入版本状态" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="净化后的原始文件名">
          <el-input v-model="queryForm.sourceFileName" placeholder="请输入净化后的原始文件名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="原始文件MIME类型">
          <el-input v-model="queryForm.sourceContentType" placeholder="请输入原始文件MIME类型" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="受控本地存储相对路径">
          <el-input v-model="queryForm.sourceStoragePath" placeholder="请输入受控本地存储相对路径" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="原始文件SHA-256">
          <el-input v-model="queryForm.sourceSha256" placeholder="请输入原始文件SHA-256" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="原始文件大小，单位字节">
          <el-input v-model="queryForm.sourceFileSize" placeholder="请输入原始文件大小，单位字节" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="FAQ标准问题，仅FAQ来源使用">
          <el-input v-model="queryForm.faqQuestion" placeholder="请输入FAQ标准问题，仅FAQ来源使用" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="FAQ标准答案，仅FAQ来源使用">
          <el-input v-model="queryForm.faqAnswer" placeholder="请输入FAQ标准答案，仅FAQ来源使用" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="解析器名称，如 Docling">
          <el-input v-model="queryForm.parserName" placeholder="请输入解析器名称，如 Docling" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="解析器版本">
          <el-input v-model="queryForm.parserVersion" placeholder="请输入解析器版本" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="解析服务任务ID">
          <el-input v-model="queryForm.parserTaskId" placeholder="请输入解析服务任务ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="结构化解析产物相对路径">
          <el-input v-model="queryForm.parsedStoragePath" placeholder="请输入结构化解析产物相对路径" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="切片数量">
          <el-input v-model="queryForm.chunkCount" placeholder="请输入切片数量" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="索引状态">
          <el-input v-model="queryForm.indexStatus" placeholder="请输入索引状态" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="向量配置键，如 qwen-4096-v1；与 collection/维度对应，审核通过后写入">
          <el-input v-model="queryForm.embeddingProfile" placeholder="请输入向量配置键，如 qwen-4096-v1；与 collection/维度对应，审核通过后写入" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="外部向量模型ID">
          <el-input v-model="queryForm.embeddingModel" placeholder="请输入外部向量模型ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="索引完成时间">
          <el-input v-model="queryForm.indexCompletedTime" placeholder="请输入索引完成时间" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="运营与同主题并列排序优先级，数值越大越靠前；不写入Milvus过滤">
          <el-input v-model="queryForm.priority" placeholder="请输入运营与同主题并列排序优先级，数值越大越靠前；不写入Milvus过滤" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="版本已选标签编码数组，INDEX任务同步到Milvus Entity tags字段">
          <el-input v-model="queryForm.tagsJson" placeholder="请输入版本已选标签编码数组，INDEX任务同步到Milvus Entity tags字段" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="审核用户ID">
          <el-input v-model="queryForm.reviewerUserId" placeholder="请输入审核用户ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="审核时间">
          <el-input v-model="queryForm.reviewTime" placeholder="请输入审核时间" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input v-model="queryForm.reviewComment" placeholder="请输入审核意见" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="创建用户ID">
          <el-input v-model="queryForm.createUserId" placeholder="请输入创建用户ID" clearable style="width: 200px" />
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
    <div class="knowledge_revision-page__header">
      <div class="knowledge_revision-page__title-group">
        <h2>管理知识版本表数据</h2>
      </div>
      <el-button type="primary" v-permission="'knowledge_revision:add'" @click="handleCreate">新增知识版本表</el-button>
    </div>

    <SortableTable :data="tableData" border stripe style="width: 100%" :enable-multi-sort="true" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('G2_FIELD_ID', 'ID')" width="120" />
      <el-table-column prop="organId" label="机构ID" width="140" />
      <el-table-column prop="knowledgeId" label="知识主题ID" width="140" />
      <el-table-column prop="revisionNo" label="版本号，如 v3 或 2026.10.03" width="180" />
      <el-table-column prop="sourceType" label="来源类型" width="180" />
      <el-table-column prop="revisionStatus" label="版本状态" width="180" />
      <el-table-column prop="sourceFileName" label="净化后的原始文件名" width="180" />
      <el-table-column prop="sourceContentType" label="原始文件MIME类型" width="180" />
      <el-table-column prop="sourceStoragePath" label="受控本地存储相对路径" width="180" />
      <el-table-column prop="sourceSha256" label="原始文件SHA-256" width="180" />
      <el-table-column prop="sourceFileSize" label="原始文件大小，单位字节" width="140" />
      <el-table-column prop="faqQuestion" label="FAQ标准问题，仅FAQ来源使用" width="180" />
      <el-table-column prop="faqAnswer" label="FAQ标准答案，仅FAQ来源使用" width="180" />
      <el-table-column prop="parserName" label="解析器名称，如 Docling" width="180" />
      <el-table-column prop="parserVersion" label="解析器版本" width="180" />
      <el-table-column prop="parserTaskId" label="解析服务任务ID" width="180" />
      <el-table-column prop="parsedStoragePath" label="结构化解析产物相对路径" width="180" />
      <el-table-column prop="chunkCount" label="切片数量" width="140" />
      <el-table-column prop="indexStatus" label="索引状态" width="180" />
      <el-table-column prop="embeddingProfile" label="向量配置键，如 qwen-4096-v1；与 collection/维度对应，审核通过后写入" width="180" />
      <el-table-column prop="embeddingModel" label="外部向量模型ID" width="180" />
      <el-table-column prop="indexCompletedTime" label="索引完成时间" width="180" />
      <el-table-column prop="priority" label="运营与同主题并列排序优先级，数值越大越靠前；不写入Milvus过滤" width="140" />
      <el-table-column prop="tagsJson" label="版本已选标签编码数组，INDEX任务同步到Milvus Entity tags字段" width="180" />
      <el-table-column prop="reviewerUserId" label="审核用户ID" width="140" />
      <el-table-column prop="reviewTime" label="审核时间" width="180" />
      <el-table-column prop="reviewComment" label="审核意见" width="180" />
      <el-table-column prop="createUserId" label="创建用户ID" width="140" />
      <TableColumn prop="createTime" :label="$t('G2_FIELD_CREATE_TIME', '创建时间')" width="180" sortable="custom" />
      <TableColumn prop="updateTime" :label="$t('G2_FIELD_UPDATE_TIME', '更新时间')" width="180" sortable="custom" />
      <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" fixed="right" width="280">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleView(row)">{{ $t('G2_BTN_DETAIL', '明细') }}</el-button>
          <el-button type="primary" v-permission="'knowledge_revision:edit'" link size="small" @click="handleEdit(row)">{{ $t('G2_BTN_EDIT', '编辑') }}</el-button>
          <el-button type="danger" v-permission="'knowledge_revision:delete'" link size="small" @click="handleDelete(row)">{{ $t('G2_BTN_DELETE', '删除') }}</el-button>
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
    <div class="knowledge_revision-page__pagination">
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
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑知识版本表' : '新增知识版本表'" width="520px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="机构ID" prop="organId">
          <el-input v-model="editForm.organId" placeholder="请输入机构ID" />
        </el-form-item>
        <el-form-item label="知识主题ID" prop="knowledgeId">
          <el-input v-model="editForm.knowledgeId" placeholder="请输入知识主题ID" />
        </el-form-item>
        <el-form-item label="版本号，如 v3 或 2026.10.03" prop="revisionNo">
          <el-input v-model="editForm.revisionNo" placeholder="请输入版本号，如 v3 或 2026.10.03" />
        </el-form-item>
        <el-form-item label="来源类型" prop="sourceType">
          <el-input v-model="editForm.sourceType" placeholder="请输入来源类型" />
        </el-form-item>
        <el-form-item label="版本状态" prop="revisionStatus">
          <el-input v-model="editForm.revisionStatus" placeholder="请输入版本状态" />
        </el-form-item>
        <el-form-item label="净化后的原始文件名" prop="sourceFileName">
          <el-input v-model="editForm.sourceFileName" placeholder="请输入净化后的原始文件名" />
        </el-form-item>
        <el-form-item label="原始文件MIME类型" prop="sourceContentType">
          <el-input v-model="editForm.sourceContentType" placeholder="请输入原始文件MIME类型" />
        </el-form-item>
        <el-form-item label="受控本地存储相对路径" prop="sourceStoragePath">
          <el-input v-model="editForm.sourceStoragePath" placeholder="请输入受控本地存储相对路径" />
        </el-form-item>
        <el-form-item label="原始文件SHA-256" prop="sourceSha256">
          <el-input v-model="editForm.sourceSha256" placeholder="请输入原始文件SHA-256" />
        </el-form-item>
        <el-form-item label="原始文件大小，单位字节" prop="sourceFileSize">
          <el-input v-model="editForm.sourceFileSize" placeholder="请输入原始文件大小，单位字节" />
        </el-form-item>
        <el-form-item label="FAQ标准问题，仅FAQ来源使用" prop="faqQuestion">
          <el-input v-model="editForm.faqQuestion" placeholder="请输入FAQ标准问题，仅FAQ来源使用" />
        </el-form-item>
        <el-form-item label="FAQ标准答案，仅FAQ来源使用" prop="faqAnswer">
          <el-input v-model="editForm.faqAnswer" placeholder="请输入FAQ标准答案，仅FAQ来源使用" />
        </el-form-item>
        <el-form-item label="解析器名称，如 Docling" prop="parserName">
          <el-input v-model="editForm.parserName" placeholder="请输入解析器名称，如 Docling" />
        </el-form-item>
        <el-form-item label="解析器版本" prop="parserVersion">
          <el-input v-model="editForm.parserVersion" placeholder="请输入解析器版本" />
        </el-form-item>
        <el-form-item label="解析服务任务ID" prop="parserTaskId">
          <el-input v-model="editForm.parserTaskId" placeholder="请输入解析服务任务ID" />
        </el-form-item>
        <el-form-item label="结构化解析产物相对路径" prop="parsedStoragePath">
          <el-input v-model="editForm.parsedStoragePath" placeholder="请输入结构化解析产物相对路径" />
        </el-form-item>
        <el-form-item label="切片数量" prop="chunkCount">
          <el-input v-model="editForm.chunkCount" placeholder="请输入切片数量" />
        </el-form-item>
        <el-form-item label="索引状态" prop="indexStatus">
          <el-input v-model="editForm.indexStatus" placeholder="请输入索引状态" />
        </el-form-item>
        <el-form-item label="向量配置键，如 qwen-4096-v1；与 collection/维度对应，审核通过后写入" prop="embeddingProfile">
          <el-input v-model="editForm.embeddingProfile" placeholder="请输入向量配置键，如 qwen-4096-v1；与 collection/维度对应，审核通过后写入" />
        </el-form-item>
        <el-form-item label="外部向量模型ID" prop="embeddingModel">
          <el-input v-model="editForm.embeddingModel" placeholder="请输入外部向量模型ID" />
        </el-form-item>
        <el-form-item label="索引完成时间" prop="indexCompletedTime">
          <el-input v-model="editForm.indexCompletedTime" placeholder="请输入索引完成时间" />
        </el-form-item>
        <el-form-item label="运营与同主题并列排序优先级，数值越大越靠前；不写入Milvus过滤" prop="priority">
          <el-input v-model="editForm.priority" placeholder="请输入运营与同主题并列排序优先级，数值越大越靠前；不写入Milvus过滤" />
        </el-form-item>
        <el-form-item label="版本已选标签编码数组，INDEX任务同步到Milvus Entity tags字段" prop="tagsJson">
          <el-input v-model="editForm.tagsJson" placeholder="请输入版本已选标签编码数组，INDEX任务同步到Milvus Entity tags字段" />
        </el-form-item>
        <el-form-item label="审核用户ID" prop="reviewerUserId">
          <el-input v-model="editForm.reviewerUserId" placeholder="请输入审核用户ID" />
        </el-form-item>
        <el-form-item label="审核时间" prop="reviewTime">
          <el-input v-model="editForm.reviewTime" placeholder="请输入审核时间" />
        </el-form-item>
        <el-form-item label="审核意见" prop="reviewComment">
          <el-input v-model="editForm.reviewComment" placeholder="请输入审核意见" />
        </el-form-item>
        <el-form-item label="创建用户ID" prop="createUserId">
          <el-input v-model="editForm.createUserId" placeholder="请输入创建用户ID" />
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
    <el-dialog v-model="detailDialogVisible" title="知识版本表明细" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_ID', 'ID')">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="机构ID">{{ currentRow?.organId }}</el-descriptions-item>
        <el-descriptions-item label="知识主题ID">{{ currentRow?.knowledgeId }}</el-descriptions-item>
        <el-descriptions-item label="版本号，如 v3 或 2026.10.03">{{ currentRow?.revisionNo }}</el-descriptions-item>
        <el-descriptions-item label="来源类型">{{ currentRow?.sourceType }}</el-descriptions-item>
        <el-descriptions-item label="版本状态">{{ currentRow?.revisionStatus }}</el-descriptions-item>
        <el-descriptions-item label="净化后的原始文件名">{{ currentRow?.sourceFileName }}</el-descriptions-item>
        <el-descriptions-item label="原始文件MIME类型">{{ currentRow?.sourceContentType }}</el-descriptions-item>
        <el-descriptions-item label="受控本地存储相对路径">{{ currentRow?.sourceStoragePath }}</el-descriptions-item>
        <el-descriptions-item label="原始文件SHA-256">{{ currentRow?.sourceSha256 }}</el-descriptions-item>
        <el-descriptions-item label="原始文件大小，单位字节">{{ currentRow?.sourceFileSize }}</el-descriptions-item>
        <el-descriptions-item label="FAQ标准问题，仅FAQ来源使用">{{ currentRow?.faqQuestion }}</el-descriptions-item>
        <el-descriptions-item label="FAQ标准答案，仅FAQ来源使用">{{ currentRow?.faqAnswer }}</el-descriptions-item>
        <el-descriptions-item label="解析器名称，如 Docling">{{ currentRow?.parserName }}</el-descriptions-item>
        <el-descriptions-item label="解析器版本">{{ currentRow?.parserVersion }}</el-descriptions-item>
        <el-descriptions-item label="解析服务任务ID">{{ currentRow?.parserTaskId }}</el-descriptions-item>
        <el-descriptions-item label="结构化解析产物相对路径">{{ currentRow?.parsedStoragePath }}</el-descriptions-item>
        <el-descriptions-item label="切片数量">{{ currentRow?.chunkCount }}</el-descriptions-item>
        <el-descriptions-item label="索引状态">{{ currentRow?.indexStatus }}</el-descriptions-item>
        <el-descriptions-item label="向量配置键，如 qwen-4096-v1；与 collection/维度对应，审核通过后写入">{{ currentRow?.embeddingProfile }}</el-descriptions-item>
        <el-descriptions-item label="外部向量模型ID">{{ currentRow?.embeddingModel }}</el-descriptions-item>
        <el-descriptions-item label="索引完成时间">{{ currentRow?.indexCompletedTime }}</el-descriptions-item>
        <el-descriptions-item label="运营与同主题并列排序优先级，数值越大越靠前；不写入Milvus过滤">{{ currentRow?.priority }}</el-descriptions-item>
        <el-descriptions-item label="版本已选标签编码数组，INDEX任务同步到Milvus Entity tags字段">{{ currentRow?.tagsJson }}</el-descriptions-item>
        <el-descriptions-item label="审核用户ID">{{ currentRow?.reviewerUserId }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ currentRow?.reviewTime }}</el-descriptions-item>
        <el-descriptions-item label="审核意见">{{ currentRow?.reviewComment }}</el-descriptions-item>
        <el-descriptions-item label="创建用户ID">{{ currentRow?.createUserId }}</el-descriptions-item>
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
import { KnowledgeRevisionApi } from './api';
import type { KnowledgeRevision, KnowledgeRevisionPayload, KnowledgeRevisionQuery } from './type';
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
  knowledgeId: undefined,
  revisionNo: '',
  sourceType: '',
  revisionStatus: '',
  sourceFileName: '',
  sourceContentType: '',
  sourceStoragePath: '',
  sourceSha256: '',
  sourceFileSize: undefined,
  faqQuestion: '',
  faqAnswer: '',
  parserName: '',
  parserVersion: '',
  parserTaskId: '',
  parsedStoragePath: '',
  chunkCount: undefined,
  indexStatus: '',
  embeddingProfile: '',
  embeddingModel: '',
  indexCompletedTime: '',
  priority: undefined,
  tagsJson: '',
  reviewerUserId: undefined,
  reviewTime: '',
  reviewComment: '',
  createUserId: undefined,
});

// 分页相关状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 定义列表引用
const tableData = ref<KnowledgeRevision[]>([]);

// 加载列表数据
const loadData = async () => {
  try {
    // 合并基础查询 + 业务查询，并过滤空值
    const query = Object.fromEntries(
      Object.entries({ ...baseQueryForm.value, ...queryForm })
        .filter(([_, v]) => (v ?? '') !== '' && [v].flat().length)
    ) as KnowledgeRevisionQuery;

    // 请求分页数据
    const pageData = await KnowledgeRevisionApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeRevisionQuery);

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
  queryForm.knowledgeId = undefined;
  queryForm.revisionNo = '';
  queryForm.sourceType = '';
  queryForm.revisionStatus = '';
  queryForm.sourceFileName = '';
  queryForm.sourceContentType = '';
  queryForm.sourceStoragePath = '';
  queryForm.sourceSha256 = '';
  queryForm.sourceFileSize = undefined;
  queryForm.faqQuestion = '';
  queryForm.faqAnswer = '';
  queryForm.parserName = '';
  queryForm.parserVersion = '';
  queryForm.parserTaskId = '';
  queryForm.parsedStoragePath = '';
  queryForm.chunkCount = undefined;
  queryForm.indexStatus = '';
  queryForm.embeddingProfile = '';
  queryForm.embeddingModel = '';
  queryForm.indexCompletedTime = '';
  queryForm.priority = undefined;
  queryForm.tagsJson = '';
  queryForm.reviewerUserId = undefined;
  queryForm.reviewTime = '';
  queryForm.reviewComment = '';
  queryForm.createUserId = undefined;

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
const currentRow = ref<KnowledgeRevision | null>(null);
// 明细弹窗引用
const detailDialogVisible = ref(false);

// 查询数据明细
const handleView = (row: KnowledgeRevision) => {
  currentRow.value = { ...row };
  detailDialogVisible.value = true;
};

// 删除数据记录
const handleDelete = (row: KnowledgeRevision) => {
  ElMessageBox.confirm(`确认删除知识版本表「${row.id}」吗？`, t('G2_LBL_TIP', '提示'), {
    type: 'warning',
  })
    .then(async () => {
      try {
        await KnowledgeRevisionApi.remove(row.id);
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
  knowledgeId: undefined as number | undefined,
  revisionNo: '',
  sourceType: '',
  revisionStatus: '',
  sourceFileName: '',
  sourceContentType: '',
  sourceStoragePath: '',
  sourceSha256: '',
  sourceFileSize: undefined as number | undefined,
  faqQuestion: '',
  faqAnswer: '',
  parserName: '',
  parserVersion: '',
  parserTaskId: '',
  parsedStoragePath: '',
  chunkCount: undefined as number | undefined,
  indexStatus: '',
  embeddingProfile: '',
  embeddingModel: '',
  indexCompletedTime: '',
  priority: undefined as number | undefined,
  tagsJson: '',
  reviewerUserId: undefined as number | undefined,
  reviewTime: '',
  reviewComment: '',
  createUserId: undefined as number | undefined,
});

// 表单校验规则
const editRules: FormRules = {
  organId: [{ required: true, message: '请输入机构标识', trigger: 'blur' }],
  knowledgeId: [{ required: true, message: '请输入知识主题标识', trigger: 'blur' }],
  revisionNo: [{ required: true, message: '请输入版本号，如 v3 或 2026.10.03', trigger: 'blur' }],
  sourceType: [{ required: true, message: '请输入来源类型[FILE:文件, FAQ:结构化问答]', trigger: 'blur' }],
  revisionStatus: [{ required: true, message: '请输入版本状态[DRAFT,PARSING,PARSE_FAILED,REVIEWING,INDEXING,INDEX_FAILED,READY_TO_PUBLISH,PUBLISHED,DEPRECATED,REJECTED]', trigger: 'blur' }],
  chunkCount: [{ required: true, message: '请输入切片数量', trigger: 'blur' }],
  indexStatus: [{ required: true, message: '请输入索引状态[PENDING,INDEXING,INDEXED,FAILED,DELETING,DELETED]', trigger: 'blur' }],
  priority: [{ required: true, message: '请输入运营与同主题并列排序优先级，数值越大越靠前；不写入Milvus过滤', trigger: 'blur' }],
};

// 打开创建弹窗
const handleCreate = () => {
  isEdit.value = false;
  editFormRef.value?.clearValidate();

  editForm.organId = undefined;
  editForm.knowledgeId = undefined;
  editForm.revisionNo = '';
  editForm.sourceType = '';
  editForm.revisionStatus = '';
  editForm.sourceFileName = '';
  editForm.sourceContentType = '';
  editForm.sourceStoragePath = '';
  editForm.sourceSha256 = '';
  editForm.sourceFileSize = undefined;
  editForm.faqQuestion = '';
  editForm.faqAnswer = '';
  editForm.parserName = '';
  editForm.parserVersion = '';
  editForm.parserTaskId = '';
  editForm.parsedStoragePath = '';
  editForm.chunkCount = undefined;
  editForm.indexStatus = '';
  editForm.embeddingProfile = '';
  editForm.embeddingModel = '';
  editForm.indexCompletedTime = '';
  editForm.priority = undefined;
  editForm.tagsJson = '';
  editForm.reviewerUserId = undefined;
  editForm.reviewTime = '';
  editForm.reviewComment = '';
  editForm.createUserId = undefined;
  editDialogVisible.value = true;
};

// 打开修改弹窗
const handleEdit = (row: KnowledgeRevision) => {
  isEdit.value = true;
  editFormRef.value?.clearValidate();

  editForm.id = row.id;
  editForm.organId = row.organId;
  editForm.knowledgeId = row.knowledgeId;
  editForm.revisionNo = row.revisionNo;
  editForm.sourceType = row.sourceType;
  editForm.revisionStatus = row.revisionStatus;
  editForm.sourceFileName = row.sourceFileName;
  editForm.sourceContentType = row.sourceContentType;
  editForm.sourceStoragePath = row.sourceStoragePath;
  editForm.sourceSha256 = row.sourceSha256;
  editForm.sourceFileSize = row.sourceFileSize;
  editForm.faqQuestion = row.faqQuestion;
  editForm.faqAnswer = row.faqAnswer;
  editForm.parserName = row.parserName;
  editForm.parserVersion = row.parserVersion;
  editForm.parserTaskId = row.parserTaskId;
  editForm.parsedStoragePath = row.parsedStoragePath;
  editForm.chunkCount = row.chunkCount;
  editForm.indexStatus = row.indexStatus;
  editForm.embeddingProfile = row.embeddingProfile;
  editForm.embeddingModel = row.embeddingModel;
  editForm.indexCompletedTime = row.indexCompletedTime;
  editForm.priority = row.priority;
  editForm.tagsJson = row.tagsJson;
  editForm.reviewerUserId = row.reviewerUserId;
  editForm.reviewTime = row.reviewTime;
  editForm.reviewComment = row.reviewComment;
  editForm.createUserId = row.createUserId;
  editDialogVisible.value = true;
};

// 提交数据表单
const submitEdit = async () => {
  if (!editFormRef.value) return;
  const valid = await editFormRef.value.validate();
  if (!valid) return;

  const payload: KnowledgeRevisionPayload = {
    organId: editForm.organId,
    knowledgeId: editForm.knowledgeId,
    revisionNo: editForm.revisionNo,
    sourceType: editForm.sourceType,
    revisionStatus: editForm.revisionStatus,
    sourceFileName: editForm.sourceFileName,
    sourceContentType: editForm.sourceContentType,
    sourceStoragePath: editForm.sourceStoragePath,
    sourceSha256: editForm.sourceSha256,
    sourceFileSize: editForm.sourceFileSize,
    faqQuestion: editForm.faqQuestion,
    faqAnswer: editForm.faqAnswer,
    parserName: editForm.parserName,
    parserVersion: editForm.parserVersion,
    parserTaskId: editForm.parserTaskId,
    parsedStoragePath: editForm.parsedStoragePath,
    chunkCount: editForm.chunkCount,
    indexStatus: editForm.indexStatus,
    embeddingProfile: editForm.embeddingProfile,
    embeddingModel: editForm.embeddingModel,
    indexCompletedTime: editForm.indexCompletedTime,
    priority: editForm.priority,
    tagsJson: editForm.tagsJson,
    reviewerUserId: editForm.reviewerUserId,
    reviewTime: editForm.reviewTime,
    reviewComment: editForm.reviewComment,
    createUserId: editForm.createUserId,
  };

  try {
    // 编辑模式下，将 id 添加到 payload 中
    if (isEdit.value) {
      payload.id = editForm.id;
    }
    await KnowledgeRevisionApi.save(payload);
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
.knowledge_revision-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}

.knowledge_revision-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  margin-top: 0;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}

.knowledge_revision-page__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.knowledge_revision-page__header h2 {
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

.knowledge_revision-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}

.knowledge_revision-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
