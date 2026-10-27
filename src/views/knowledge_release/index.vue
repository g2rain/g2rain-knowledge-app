<template>
  <div class="knowledge_release-page">
    <el-card class="knowledge_release-page__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item label="视图类型">
          <el-select v-model="queryForm.viewType" style="width: 160px" @change="handleSearch">
            <el-option label="待发布" value="ready" />
            <el-option label="线上内容" value="online" />
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

    <div class="knowledge_release-page__header">
      <h2>发布管理</h2>
      <el-tag type="info">默认待发布队列</el-tag>
    </div>

    <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="knowledgeName" label="知识名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="revisionNo" label="版本号" width="120" />
      <el-table-column
        v-if="isOnlineView"
        prop="releaseReason"
        label="最近发布原因"
        min-width="160"
        show-overflow-tooltip
      />
      <el-table-column v-if="isOnlineView" prop="publishedTime" label="发布时间" width="170" />
      <el-table-column v-else prop="updateTime" label="更新时间" width="170" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="!isOnlineView"
            type="primary"
            link
            v-permission="'knowledge_release:publish'"
            @click="publishRow(row)"
          >
            发布
          </el-button>
          <el-button v-if="isOnlineView" type="primary" link @click="openHistory(row)">历史版本</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-if="!loading && !tableData.length" :description="emptyText" :image-size="80" />

    <div class="knowledge_release-page__pagination">
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

    <el-drawer v-model="historyVisible" title="可用历史版本" :size="OVERLAY_SIZE.drawer" destroy-on-close>
      <div v-if="historyContext" class="history-summary">
        {{ historyContext.knowledgeName }} · 当前线上：{{ historyContext.revisionNo }}
      </div>
      <el-table :data="historyRows" border stripe>
        <el-table-column prop="revisionNo" label="版本号" width="120" />
        <el-table-column prop="revisionStatus" label="状态" width="120">
          <template #default="{ row }">{{ getRevisionStatusInfo(row.revisionStatus).label }}</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              v-if="row.revisionStatus === 'DEPRECATED' || row.revisionStatus === 'PUBLISHED'"
              type="primary"
              link
              v-permission="'knowledge_release:rollback'"
              :disabled="row.id === historyContext?.activeRevisionId"
              @click="rollbackTo(row)"
            >
              回滚
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { QueryForm } from '@g2rain/ui';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import { compactQuery } from '@shared/knowledge/entity';
import { OVERLAY_SIZE } from '@shared/knowledge/overlay';
import { KnowledgeReleaseApi } from './api';
import type { KnowledgeRelease, KnowledgeReleaseQuery } from './type';
import { KnowledgeRevisionApi } from '@/views/knowledge_revision/api';
import type { KnowledgeRevision, KnowledgeRevisionQuery } from '@/views/knowledge_revision/type';
import { KnowledgeItemApi } from '@/views/knowledge_item/api';
import { getRevisionStatusInfo } from '@/views/knowledge_revision/status';

type ViewType = 'ready' | 'online';

interface ReleaseRow {
  knowledgeId: number;
  knowledgeName: string;
  revisionId: number;
  revisionNo: string;
  revisionVersion: number;
  releaseId?: number;
  releaseVersion?: number;
  activeRevisionId?: number;
  releaseReason?: string;
  publishedTime?: string;
  updateTime?: string;
}

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);
const baseQueryForm = ref<BaseSelectListDto>({});
const queryForm = reactive({
  viewType: 'ready' as ViewType,
  knowledgeName: '',
  revisionNo: '',
});
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 });
const loading = ref(false);
const tableData = ref<ReleaseRow[]>([]);
const historyVisible = ref(false);
const historyContext = ref<ReleaseRow | null>(null);
const historyRows = ref<KnowledgeRevision[]>([]);
const itemNameCache = ref<Record<number, string>>({});

const isOnlineView = computed(() => queryForm.viewType === 'online');

const emptyText = computed(() =>
  queryForm.viewType === 'ready' ? '暂无待发布内容，可切换线上内容查看' : '暂无线上内容',
);

const resolveItemName = async (knowledgeId: number) => {
  if (!itemNameCache.value[knowledgeId]) {
    try {
      itemNameCache.value[knowledgeId] = (await KnowledgeItemApi.getById(knowledgeId)).knowledgeName;
    } catch {
      itemNameCache.value[knowledgeId] = `#${knowledgeId}`;
    }
  }
  return itemNameCache.value[knowledgeId];
};

const applyClientFilters = (rows: ReleaseRow[]) => {
  let list = rows;
  const nameKw = queryForm.knowledgeName.trim().toLowerCase();
  const noKw = queryForm.revisionNo.trim().toLowerCase();
  if (nameKw) {
    list = list.filter((r) => r.knowledgeName.toLowerCase().includes(nameKw));
  }
  if (noKw && isOnlineView.value) {
    list = list.filter((r) => r.revisionNo.toLowerCase().includes(noKw));
  }
  return list;
};

const loadReady = async () => {
  const knowledgeName = queryForm.knowledgeName;
  const revisionNo = queryForm.revisionNo;
  const query = compactQuery({
    ...baseQueryForm.value,
    revisionStatus: 'READY_TO_PUBLISH',
    revisionNo: revisionNo.trim() || undefined,
  }) as KnowledgeRevisionQuery;

  const pageData = await KnowledgeRevisionApi.page({
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    ...query,
  } as PageSelectListDto & KnowledgeRevisionQuery);

  let rows: ReleaseRow[] = await Promise.all(
    pageData.records.map(async (r) => {
      const releases = await KnowledgeReleaseApi.list({ knowledgeId: r.knowledgeId });
      const release = releases[0];
      return {
        knowledgeId: r.knowledgeId,
        knowledgeName: await resolveItemName(r.knowledgeId),
        revisionId: r.id,
        revisionNo: r.revisionNo,
        revisionVersion: r.version,
        releaseId: release?.id,
        releaseVersion: release?.version,
        updateTime: r.updateTime,
      };
    }),
  );

  if (knowledgeName.trim()) {
    const kw = knowledgeName.trim().toLowerCase();
    rows = rows.filter((r) => r.knowledgeName.toLowerCase().includes(kw));
  }

  tableData.value = rows;
  pagination.total = knowledgeName.trim() ? rows.length : pageData.total;
};

const loadOnline = async () => {
  const query = compactQuery({
    ...baseQueryForm.value,
    releaseStatus: 'PUBLISHED',
  }) as KnowledgeReleaseQuery;

  const pageData = await KnowledgeReleaseApi.page({
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    ...query,
  } as PageSelectListDto & KnowledgeReleaseQuery);

  let rows: ReleaseRow[] = await Promise.all(
    pageData.records
      .filter((r: KnowledgeRelease) => r.activeRevisionId)
      .map(async (release: KnowledgeRelease) => {
        let revisionNo = '-';
        let revisionVersion = 0;
        try {
          const revision = await KnowledgeRevisionApi.getById(release.activeRevisionId);
          revisionNo = revision.revisionNo;
          revisionVersion = revision.version;
        } catch {
          /* ignore */
        }
        return {
          knowledgeId: release.knowledgeId,
          knowledgeName: await resolveItemName(release.knowledgeId),
          revisionId: release.activeRevisionId,
          revisionNo,
          revisionVersion,
          releaseId: release.id,
          releaseVersion: release.version,
          activeRevisionId: release.activeRevisionId,
          releaseReason: release.releaseReason,
          publishedTime: release.publishedTime,
        };
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
    if (queryForm.viewType === 'ready') await loadReady();
    else await loadOnline();
  } catch {
    // 请求失败已由 http 层统一提示
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  void loadData();
};

const handleReset = () => {
  baseQueryForm.value = {};
  queryForm.viewType = 'ready';
  queryForm.knowledgeName = '';
  queryForm.revisionNo = '';
  pagination.pageNum = 1;
  void loadData();
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

const ensureRelease = async (row: ReleaseRow): Promise<{ releaseId: number; releaseVersion: number } | null> => {
  let releases = await KnowledgeReleaseApi.list({ knowledgeId: row.knowledgeId });
  if (!releases.length) {
    const id = await KnowledgeReleaseApi.save({ knowledgeId: row.knowledgeId });
    releases = await KnowledgeReleaseApi.list({ id });
    if (!releases.length) {
      releases = await KnowledgeReleaseApi.list({ knowledgeId: row.knowledgeId });
    }
  }
  const release = releases[0];
  return release ? { releaseId: release.id, releaseVersion: release.version } : null;
};

const publishRow = async (row: ReleaseRow) => {
  let reason: string | undefined;
  try {
    ({ value: reason } = await ElMessageBox.prompt(
      `确认发布「${row.knowledgeName}」版本 ${row.revisionNo}？可填写变更原因。`,
      '发布确认',
      {
        inputPlaceholder: '变更原因（可选）',
        confirmButtonText: '发布',
        cancelButtonText: '取消',
        inputValue: '',
      },
    ));
  } catch {
    // 取消发布
    return;
  }

  const revision = await KnowledgeRevisionApi.getById(row.revisionId);
  const release = await ensureRelease(row);
  if (!release) {
    ElMessage.error('发布选择记录初始化失败，请重试');
    return;
  }
  await KnowledgeReleaseApi.publish({
    releaseId: release.releaseId,
    revisionId: revision.id,
    reason: reason?.trim() || undefined,
  });
  ElMessage.success('发布成功。可通过「效果验证」检查结果');
  await loadData();
};

const openHistory = async (row: ReleaseRow) => {
  historyContext.value = row;
  const list = await KnowledgeRevisionApi.list({ knowledgeId: row.knowledgeId });
  historyRows.value = list.filter((r) =>
    ['PUBLISHED', 'DEPRECATED', 'READY_TO_PUBLISH'].includes(r.revisionStatus),
  );
  historyVisible.value = true;
};

const rollbackTo = async (target: KnowledgeRevision) => {
  if (!historyContext.value?.releaseId) return;
  try {
    await ElMessageBox.confirm(
      `确认将「${historyContext.value.knowledgeName}」从 ${historyContext.value.revisionNo} 回滚到 ${target.revisionNo}？`,
      '回滚确认',
      { type: 'warning' },
    );
    const release = await KnowledgeReleaseApi.getById(historyContext.value.releaseId);
    const revision = await KnowledgeRevisionApi.getById(target.id);
    const { value: reason } = await ElMessageBox.prompt('请填写回滚原因', '回滚原因', {
      inputPlaceholder: '变更原因',
      confirmButtonText: '回滚',
      cancelButtonText: '取消',
    });
    await KnowledgeReleaseApi.rollback({
      releaseId: release.id,
      revisionId: revision.id,
      reason: reason?.trim() || undefined,
    });
    ElMessage.success('回滚成功。可通过「效果验证」检查结果');
    historyVisible.value = false;
    await loadData();
  } catch {
    /* 取消确认或请求失败已由 http 层统一提示 */
  }
};

onMounted(() => void loadData());
</script>

<style scoped>
.knowledge_release-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  box-sizing: border-box;
}
.knowledge_release-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_release-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_release-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_release-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.history-summary {
  margin-bottom: 12px;
  color: var(--el-text-color-regular);
}
</style>
