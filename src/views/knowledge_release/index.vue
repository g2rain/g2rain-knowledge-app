<template>
  <div class="knowledge_release-page">
    <el-card class="knowledge_release-page__search" shadow="never">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="知识名称">
          <el-input v-model="filters.knowledgeName" placeholder="知识名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="filters.revisionNo" placeholder="版本号" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reload">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="knowledge_release-page__header">
      <h2>发布管理</h2>
    </div>

    <el-tabs v-model="activeTab" @tab-change="loadData">
      <el-tab-pane label="待发布" name="ready" />
      <el-tab-pane label="线上内容" name="online" />
    </el-tabs>

    <el-table v-loading="loading" :data="displayRows" border stripe>
      <el-table-column prop="knowledgeName" label="知识名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="revisionNo" label="版本号" width="120" />
      <el-table-column v-if="activeTab === 'online'" prop="releaseReason" label="最近发布原因" min-width="160" show-overflow-tooltip />
      <el-table-column v-if="activeTab === 'online'" prop="publishedTime" label="发布时间" width="170" />
      <el-table-column v-else prop="updateTime" label="更新时间" width="170" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="activeTab === 'ready'"
            type="primary"
            link
            v-permission="'knowledge_release:publish'"
            @click="publishRow(row)"
          >
            发布
          </el-button>
          <el-button v-if="activeTab === 'online'" type="primary" link @click="openHistory(row)">历史版本</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-if="!loading && !displayRows.length" :description="emptyText" :image-size="80" />

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
import { showErrorMessage } from '@/components';
import { OVERLAY_SIZE } from '@shared/knowledge/overlay';
import { KnowledgeReleaseApi } from './api';
import type { KnowledgeRelease } from './type';
import { KnowledgeRevisionApi } from '@/views/knowledge_revision/api';
import type { KnowledgeRevision } from '@/views/knowledge_revision/type';
import { KnowledgeItemApi } from '@/views/knowledge_item/api';
import { getRevisionStatusInfo } from '@/views/knowledge_revision/status';

type TabKey = 'ready' | 'online';

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

const activeTab = ref<TabKey>('ready');
const loading = ref(false);
const rows = ref<ReleaseRow[]>([]);
const filters = reactive({ knowledgeName: '', revisionNo: '' });
const historyVisible = ref(false);
const historyContext = ref<ReleaseRow | null>(null);
const historyRows = ref<KnowledgeRevision[]>([]);
const itemNameCache = ref<Record<number, string>>({});

const emptyText = computed(() =>
  activeTab.value === 'ready' ? '暂无待发布内容，可切换线上内容查看' : '暂无线上内容',
);

const displayRows = computed(() => {
  let list = rows.value;
  if (filters.knowledgeName.trim()) {
    const kw = filters.knowledgeName.trim().toLowerCase();
    list = list.filter((r) => r.knowledgeName.toLowerCase().includes(kw));
  }
  if (filters.revisionNo.trim()) {
    const kw = filters.revisionNo.trim().toLowerCase();
    list = list.filter((r) => r.revisionNo.toLowerCase().includes(kw));
  }
  return list;
});

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

const loadReady = async () => {
  const revisions = await KnowledgeRevisionApi.list({ revisionStatus: 'READY_TO_PUBLISH' });
  rows.value = await Promise.all(
    revisions.map(async (r) => {
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
};

const loadOnline = async () => {
  const releases = await KnowledgeReleaseApi.list({});
  const withActive = releases.filter((r) => r.activeRevisionId);
  rows.value = await Promise.all(
    withActive.map(async (release: KnowledgeRelease) => {
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
};

const loadData = async () => {
  loading.value = true;
  try {
    if (activeTab.value === 'ready') await loadReady();
    else await loadOnline();
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '加载失败');
  } finally {
    loading.value = false;
  }
};

const reload = () => void loadData();
const resetFilters = () => {
  filters.knowledgeName = '';
  filters.revisionNo = '';
  reload();
};

const ensureRelease = async (row: ReleaseRow): Promise<{ releaseId: number; releaseVersion: number }> => {
  let releases = await KnowledgeReleaseApi.list({ knowledgeId: row.knowledgeId });
  if (!releases.length) {
    const id = await KnowledgeReleaseApi.save({ knowledgeId: row.knowledgeId });
    releases = await KnowledgeReleaseApi.list({ id });
    if (!releases.length) {
      releases = await KnowledgeReleaseApi.list({ knowledgeId: row.knowledgeId });
    }
  }
  const release = releases[0];
  if (!release) throw new Error('发布选择记录初始化失败，请重试');
  return { releaseId: release.id, releaseVersion: release.version };
};

const publishRow = async (row: ReleaseRow) => {
  try {
    const { value: reason } = await ElMessageBox.prompt(
      `确认发布「${row.knowledgeName}」版本 ${row.revisionNo}？可填写变更原因。`,
      '发布确认',
      {
        inputPlaceholder: '变更原因（可选）',
        confirmButtonText: '发布',
        cancelButtonText: '取消',
        inputValue: '',
      },
    ).catch((e) => {
      throw e;
    });

    const revision = await KnowledgeRevisionApi.getById(row.revisionId);
    const { releaseId, releaseVersion } = await ensureRelease(row);
    await KnowledgeReleaseApi.publish({
      releaseId,
      revisionId: revision.id,
      expectedReleaseVersion: releaseVersion,
      expectedRevisionVersion: revision.version,
      reason: reason?.trim() || undefined,
    });
    ElMessage.success('发布成功。可通过「效果验证」检查结果');
    await loadData();
  } catch (error: unknown) {
    if (error === 'cancel' || error === 'close') return;
    showErrorMessage(error instanceof Error ? error.message : '发布失败');
  }
};

const openHistory = async (row: ReleaseRow) => {
  historyContext.value = row;
  try {
    const list = await KnowledgeRevisionApi.list({ knowledgeId: row.knowledgeId });
    historyRows.value = list.filter((r) =>
      ['PUBLISHED', 'DEPRECATED', 'READY_TO_PUBLISH'].includes(r.revisionStatus),
    );
    historyVisible.value = true;
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '加载历史版本失败');
  }
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
      expectedReleaseVersion: release.version,
      expectedRevisionVersion: revision.version,
      reason: reason?.trim() || undefined,
    });
    ElMessage.success('回滚成功。可通过「效果验证」检查结果');
    historyVisible.value = false;
    await loadData();
  } catch (error: unknown) {
    if (error === 'cancel' || error === 'close') return;
    showErrorMessage(error instanceof Error ? error.message : '回滚失败');
  }
};

onMounted(() => loadData());
</script>

<style scoped>
.knowledge_release-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
}
.knowledge_release-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_release-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.history-summary {
  margin-bottom: 12px;
  color: var(--el-text-color-regular);
}
</style>
