<template>
  <div class="knowledge_task-page">
    <el-card class="knowledge_task-page__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item label="队列类型">
          <el-select v-model="queryForm.queueType" style="width: 160px" @change="handleSearch">
            <el-option
              v-for="opt in queueOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="知识名称">
          <el-input v-model="queryForm.knowledgeName" placeholder="知识名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="queryForm.revisionNo" placeholder="版本号" clearable style="width: 140px" />
        </el-form-item>
        <template #actions>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </template>
      </QueryForm>
    </el-card>

    <div class="knowledge_task-page__header">
      <h2>知识处理</h2>
      <el-tag type="info">默认待处理队列</el-tag>
    </div>

    <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="knowledgeName" label="知识名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="revisionNo" label="版本号" width="110" />
      <template v-if="isPendingQueue">
        <el-table-column prop="revisionStatus" label="版本状态" width="120">
          <template #default="{ row }">{{ getRevisionStatusInfo(row.revisionStatus).label }}</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link v-permission="'knowledge_task:process'" @click="startProcess(row)">
              开始处理
            </el-button>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column prop="taskType" label="任务类型" width="110" />
        <el-table-column prop="taskStatus" label="任务状态" width="110" />
        <el-table-column prop="attemptNo" label="尝试" width="80" />
        <el-table-column label="耗时" width="100">
          <template #default="{ row }">{{ formatDuration(row) }}</template>
        </el-table-column>
        <el-table-column prop="errorCode" label="错误码" width="120" show-overflow-tooltip />
        <el-table-column prop="errorSummary" label="摘要" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)">详情</el-button>
            <el-button
              v-if="row.taskStatus === 'FAILED'"
              type="primary"
              link
              v-permission="'knowledge_task:retry'"
              @click="retryTask(row)"
            >
              重试
            </el-button>
            <el-button
              v-if="row.taskStatus === 'PENDING'"
              type="danger"
              link
              v-permission="'knowledge_task:cancel'"
              @click="cancelTask(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-empty v-if="!loading && !tableData.length" :description="emptyText" :image-size="80" />

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

    <el-drawer v-model="detailVisible" title="任务详情" :size="OVERLAY_SIZE.drawer" destroy-on-close>
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="知识名称">{{ detail.knowledgeName }}</el-descriptions-item>
        <el-descriptions-item label="版本号">{{ detail.revisionNo }}</el-descriptions-item>
        <el-descriptions-item label="任务类型">{{ detail.taskType }}</el-descriptions-item>
        <el-descriptions-item label="任务状态">{{ detail.taskStatus }}</el-descriptions-item>
        <el-descriptions-item label="版本状态">
          {{ getRevisionStatusInfo(detail.revisionStatus).label }}
        </el-descriptions-item>
        <el-descriptions-item label="尝试次数">{{ detail.attemptNo }}</el-descriptions-item>
        <el-descriptions-item label="耗时">{{ formatDuration(detail) }}</el-descriptions-item>
        <el-descriptions-item label="错误码">{{ detail.errorCode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="摘要">{{ detail.errorSummary || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { QueryForm } from '@g2rain/ui';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import { showErrorMessage } from '@/components';
import { compactQuery } from '@shared/knowledge/entity';
import { OVERLAY_SIZE, POLL_INTERVAL_MS } from '@shared/knowledge/overlay';
import { KnowledgeTaskApi } from './api';
import type { KnowledgeTask } from './type';
import { KnowledgeRevisionApi } from '@/views/knowledge_revision/api';
import type { KnowledgeRevision, KnowledgeRevisionQuery } from '@/views/knowledge_revision/type';
import type { KnowledgeTaskQuery } from './type';
import { KnowledgeItemApi } from '@/views/knowledge_item/api';
import { getRevisionStatusInfo } from '@/views/knowledge_revision/status';

type QueueType = 'pending' | 'pending_task' | 'running' | 'failed' | 'success' | 'canceled';

interface TaskRow extends Partial<KnowledgeTask> {
  knowledgeName?: string;
  revisionNo?: string;
  revisionStatus?: string;
  revisionId: number;
  id?: number;
  updateTime?: string;
}

const queueOptions: Array<{ label: string; value: QueueType }> = [
  { label: '待处理', value: 'pending' },
  { label: '待执行', value: 'pending_task' },
  { label: '运行中', value: 'running' },
  { label: '处理失败', value: 'failed' },
  { label: '成功', value: 'success' },
  { label: '已取消', value: 'canceled' },
];

const QUEUE_TASK_STATUS: Partial<Record<QueueType, string>> = {
  pending_task: 'PENDING',
  running: 'RUNNING',
  failed: 'FAILED',
  success: 'SUCCESS',
  canceled: 'CANCELED',
};

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);
const baseQueryForm = ref<BaseSelectListDto>({});
const queryForm = reactive({
  queueType: 'pending' as QueueType,
  knowledgeName: '',
  revisionNo: '',
});
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 });
const loading = ref(false);
const tableData = ref<TaskRow[]>([]);
const detailVisible = ref(false);
const detail = ref<TaskRow | null>(null);
let pollTimer: ReturnType<typeof setInterval> | null = null;
const itemNameCache = ref<Record<number, string>>({});
const revisionCache = ref<Record<number, KnowledgeRevision>>({});

const isPendingQueue = computed(() => queryForm.queueType === 'pending');

const emptyText = computed(() => {
  if (queryForm.queueType === 'pending') return '暂无待处理内容，可切换其他队列查看';
  return '暂无数据';
});

const shouldPoll = computed(
  () => queryForm.queueType === 'pending_task' || queryForm.queueType === 'running',
);

const formatDuration = (row: TaskRow) => {
  if (!row.startedTime) return '-';
  const start = Date.parse(row.startedTime.replace(/-/g, '/'));
  const end = row.finishedTime ? Date.parse(row.finishedTime.replace(/-/g, '/')) : Date.now();
  if (Number.isNaN(start) || Number.isNaN(end)) return '-';
  const sec = Math.max(0, Math.round((end - start) / 1000));
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
};

const resolveRevisionMeta = async (revisionId: number) => {
  if (!revisionCache.value[revisionId]) {
    revisionCache.value[revisionId] = await KnowledgeRevisionApi.getById(revisionId);
  }
  const revision = revisionCache.value[revisionId];
  if (!itemNameCache.value[revision.knowledgeId]) {
    try {
      const item = await KnowledgeItemApi.getById(revision.knowledgeId);
      itemNameCache.value[revision.knowledgeId] = item.knowledgeName;
    } catch {
      itemNameCache.value[revision.knowledgeId] = `#${revision.knowledgeId}`;
    }
  }
  return {
    knowledgeName: itemNameCache.value[revision.knowledgeId],
    revisionNo: revision.revisionNo,
    revisionStatus: revision.revisionStatus,
  };
};

const applyClientFilters = (rows: TaskRow[]) => {
  let list = rows;
  const nameKw = queryForm.knowledgeName.trim().toLowerCase();
  const noKw = queryForm.revisionNo.trim().toLowerCase();
  if (nameKw) {
    list = list.filter((r) => (r.knowledgeName || '').toLowerCase().includes(nameKw));
  }
  if (noKw && !isPendingQueue.value) {
    list = list.filter((r) => (r.revisionNo || '').toLowerCase().includes(noKw));
  }
  return list;
};

const loadPending = async () => {
  const knowledgeName = queryForm.knowledgeName;
  const revisionNo = queryForm.revisionNo;
  const query = compactQuery({
    ...baseQueryForm.value,
    revisionStatus: 'APPROVED',
    revisionNo: revisionNo.trim() || undefined,
  }) as KnowledgeRevisionQuery;

  const pageData = await KnowledgeRevisionApi.page({
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    ...query,
  } as PageSelectListDto & KnowledgeRevisionQuery);

  let rows: TaskRow[] = await Promise.all(
    pageData.records.map(async (r) => {
      revisionCache.value[r.id] = r;
      if (!itemNameCache.value[r.knowledgeId]) {
        try {
          itemNameCache.value[r.knowledgeId] = (await KnowledgeItemApi.getById(r.knowledgeId)).knowledgeName;
        } catch {
          itemNameCache.value[r.knowledgeId] = `#${r.knowledgeId}`;
        }
      }
      return {
        revisionId: r.id,
        knowledgeName: itemNameCache.value[r.knowledgeId],
        revisionNo: r.revisionNo,
        revisionStatus: r.revisionStatus,
        updateTime: r.updateTime,
      } as TaskRow;
    }),
  );

  if (knowledgeName.trim()) {
    const kw = knowledgeName.trim().toLowerCase();
    rows = rows.filter((r) => (r.knowledgeName || '').toLowerCase().includes(kw));
  }

  tableData.value = rows;
  pagination.total = knowledgeName.trim() ? rows.length : pageData.total;
};

const loadTasks = async () => {
  const taskStatus = QUEUE_TASK_STATUS[queryForm.queueType];
  if (!taskStatus) return;

  const query = compactQuery({
    ...baseQueryForm.value,
    taskStatus,
  }) as KnowledgeTaskQuery;

  const pageData = await KnowledgeTaskApi.page({
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    ...query,
  } as PageSelectListDto & KnowledgeTaskQuery);

  let rows: TaskRow[] = await Promise.all(
    pageData.records.map(async (task) => {
      const meta = await resolveRevisionMeta(task.revisionId);
      return { ...task, ...meta };
    }),
  );

  const filtered = applyClientFilters(rows);
  tableData.value = filtered;
  const clientFiltered =
    Boolean(queryForm.knowledgeName.trim()) || Boolean(queryForm.revisionNo.trim());
  pagination.total = clientFiltered ? filtered.length : pageData.total;
};

const loadData = async () => {
  loading.value = true;
  try {
    if (isPendingQueue.value) await loadPending();
    else await loadTasks();
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '加载失败');
  } finally {
    loading.value = false;
  }
};

const stopPoll = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const startPoll = () => {
  stopPoll();
  if (!shouldPoll.value) return;
  pollTimer = setInterval(() => {
    void loadData();
  }, POLL_INTERVAL_MS);
};

const handleSearch = () => {
  pagination.pageNum = 1;
  void loadData().then(startPoll);
};

const handleReset = () => {
  queryForm.queueType = 'pending';
  queryForm.knowledgeName = '';
  queryForm.revisionNo = '';
  baseQueryForm.value = {};
  pagination.pageNum = 1;
  void loadData().then(startPoll);
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  void loadData();
};

const handlePageChange = (page: number) => {
  pagination.pageNum = page;
  void loadData();
};

const startProcess = async (row: TaskRow) => {
  try {
    await ElMessageBox.confirm(`确认开始处理版本「${row.revisionNo}」？`, '开始处理', { type: 'warning' });
    await KnowledgeTaskApi.startProcess(row.revisionId);
    ElMessage.success('已开始处理，可在「待执行 / 运行中」查看进度');
    await loadData();
  } catch (error: unknown) {
    if (error === 'cancel' || error === 'close') return;
    showErrorMessage(error instanceof Error ? error.message : '开始处理失败');
  }
};

const retryTask = async (row: TaskRow) => {
  if (!row.id || row.version == null) {
    showErrorMessage('缺少任务版本，请刷新列表后重试');
    return;
  }
  try {
    await KnowledgeTaskApi.retry({ taskId: row.id, expectedVersion: row.version });
    ElMessage.success('已提交重试');
    queryForm.queueType = 'pending_task';
    pagination.pageNum = 1;
    await loadData();
    startPoll();
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '重试失败');
  }
};

const cancelTask = async (row: TaskRow) => {
  if (!row.id || row.version == null) {
    showErrorMessage('缺少任务版本，请刷新列表后重试');
    return;
  }
  try {
    await ElMessageBox.confirm('确认取消该待执行任务？', '取消任务', { type: 'warning' });
    await KnowledgeTaskApi.cancel({ taskId: row.id, expectedVersion: row.version });
    const revision = await KnowledgeRevisionApi.getById(row.revisionId);
    ElMessage.success(`任务已取消。当前版本状态：${getRevisionStatusInfo(revision.revisionStatus).label}`);
    await loadData();
  } catch (error: unknown) {
    if (error === 'cancel' || error === 'close') return;
    showErrorMessage(error instanceof Error ? error.message : '取消失败');
  }
};

const openDetail = async (row: TaskRow) => {
  detail.value = row;
  if (row.revisionId) {
    try {
      const revision = await KnowledgeRevisionApi.getById(row.revisionId);
      detail.value = { ...row, revisionStatus: revision.revisionStatus };
      if (revision.revisionStatus === 'READY_TO_PUBLISH' && row.taskStatus === 'SUCCESS') {
        ElMessage.success('处理完成，可在发布管理发布');
      }
    } catch {
      /* ignore */
    }
  }
  detailVisible.value = true;
};

watch(
  () => queryForm.queueType,
  () => startPoll(),
);

onMounted(async () => {
  await loadData();
  startPoll();
});

onBeforeUnmount(() => stopPoll());
</script>

<style scoped>
.knowledge_task-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  box-sizing: border-box;
}
.knowledge_task-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_task-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_task-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_task-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
