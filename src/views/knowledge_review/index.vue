<template>
  <div class="knowledge_review-page">
    <el-card class="knowledge_review-page__search" shadow="never">
      <QueryForm ref="queryFormRef" v-model="baseQueryForm" @search="handleSearch">
        <el-form-item label="知识名称">
          <el-input v-model="queryForm.knowledgeName" placeholder="按主题名称筛选" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="queryForm.revisionNo" placeholder="版本号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.revisionStatus" placeholder="状态" clearable style="width: 160px">
            <el-option label="待审核" value="REVIEWING" />
            <el-option label="草稿" value="DRAFT" />
            <el-option label="已通过" value="APPROVED" />
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

    <div class="knowledge_review-page__header">
      <h2>内容审核</h2>
      <el-tag type="warning">默认待审核队列</el-tag>
    </div>

    <div class="knowledge_review-page__body">
      <div class="knowledge_review-page__list">
        <el-table
          :data="tableData"
          border
          stripe
          highlight-current-row
          height="100%"
          @current-change="onSelectRow"
        >
          <el-table-column prop="knowledgeName" label="知识名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="revisionNo" label="版本" width="100" />
          <el-table-column prop="sourceType" label="类型" width="80">
            <template #default="{ row }">{{ typeLabel(row.sourceType) }}</template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="80" />
          <el-table-column prop="updateTime" label="更新时间" width="160" />
        </el-table>
        <el-empty v-if="!loading && !tableData.length" :description="emptyText" :image-size="80" />
        <div class="knowledge_review-page__pagination">
          <el-pagination
            v-model:current-page="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50]"
            :total="pagination.total"
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <div class="knowledge_review-page__detail" v-loading="detailLoading">
        <template v-if="current">
          <div class="detail-toolbar">
            <h3>{{ current.knowledgeName }} · {{ current.revisionNo }}</h3>
            <div>
              <el-button
                v-if="current.sourceType === 'FILE' && current.sourceFileName"
                v-permission="'knowledge_revision:download-source'"
                @click="downloadSource"
              >
                下载原文
              </el-button>
              <el-button
                type="danger"
                v-permission="'knowledge_revision:review-reject'"
                @click="rejectReview"
              >
                驳回
              </el-button>
              <el-button
                type="primary"
                v-permission="'knowledge_revision:review-approve'"
                @click="approveReview"
              >
                通过
              </el-button>
            </div>
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="类型">{{ typeLabel(current.sourceType) }}</el-descriptions-item>
            <el-descriptions-item label="优先级">{{ current.priority }}</el-descriptions-item>
            <el-descriptions-item label="标签">{{ formatTags(current.tagsJson) }}</el-descriptions-item>
            <el-descriptions-item v-if="current.sourceType === 'FAQ'" label="标准问题">
              {{ current.faqQuestion }}
            </el-descriptions-item>
            <el-descriptions-item v-if="current.sourceType === 'FAQ'" label="标准答案">
              <pre class="block-text">{{ current.faqAnswer }}</pre>
            </el-descriptions-item>
            <el-descriptions-item v-else label="源文件">
              {{ current.sourceFileName || '未上传' }}
              <div class="field-tip">文件请下载后在本地查看；下载成功不等于审核完成</div>
            </el-descriptions-item>
            <el-descriptions-item label="审核意见">{{ current.reviewComment || '-' }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-empty v-else description="请选择左侧待审内容" :image-size="80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { t } from '@platform/i18n';
import { QueryForm } from '@g2rain/ui';
import type { BaseSelectListDto, PageSelectListDto } from '@platform/types/api.type';
import { showErrorMessage } from '@/components';
import { compactQuery } from '@shared/knowledge/entity';
import { KnowledgeRevisionApi } from '@/views/knowledge_revision/api';
import type { KnowledgeRevision, KnowledgeRevisionQuery } from '@/views/knowledge_revision/type';
import { KnowledgeItemApi } from '@/views/knowledge_item/api';
import { KnowledgeTagApi } from '@/views/knowledge_tag/api';
import type { KnowledgeTag } from '@/views/knowledge_tag/type';
import { KNOWLEDGE_TYPE_OPTIONS } from '@/views/knowledge_revision/status';

interface ReviewRow extends KnowledgeRevision {
  knowledgeName?: string;
}

const typeLabel = (s?: string) => KNOWLEDGE_TYPE_OPTIONS.find((o) => o.value === s)?.label || s || '-';

const queryFormRef = ref<InstanceType<typeof QueryForm> | null>(null);
const baseQueryForm = ref<BaseSelectListDto>({});
const queryForm = reactive({
  knowledgeName: '',
  revisionNo: '',
  revisionStatus: 'REVIEWING',
});
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 });
const tableData = ref<ReviewRow[]>([]);
const current = ref<ReviewRow | null>(null);
const loading = ref(false);
const detailLoading = ref(false);
const tagOptions = ref<KnowledgeTag[]>([]);
const itemNameMap = ref<Record<number, string>>({});

const emptyText = computed(() => {
  if (queryForm.revisionStatus === 'REVIEWING') return '暂无待审核内容，可切换其他状态查看';
  return '暂无数据';
});

const parseTagCodes = (tagsJson?: string): string[] => {
  if (!tagsJson) return [];
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const formatTags = (tagsJson?: string) => {
  const codes = parseTagCodes(tagsJson);
  if (!codes.length) return '-';
  return codes
    .map((code) => {
      const tag = tagOptions.value.find((t) => t.tagCode === code);
      return tag ? `${tag.tagName}（${code}）` : code;
    })
    .join('、');
};

const resolveKnowledgeNames = async (rows: KnowledgeRevision[]) => {
  const ids = [...new Set(rows.map((r) => r.knowledgeId).filter(Boolean))];
  await Promise.all(
    ids.map(async (id) => {
      if (itemNameMap.value[id]) return;
      try {
        const item = await KnowledgeItemApi.getById(id);
        itemNameMap.value[id] = item.knowledgeName;
      } catch {
        itemNameMap.value[id] = `#${id}`;
      }
    }),
  );
};

const loadData = async () => {
  loading.value = true;
  try {
    const { knowledgeName, ...rest } = queryForm;
    const query = compactQuery({ ...baseQueryForm.value, ...rest }) as KnowledgeRevisionQuery;
    const pageData = await KnowledgeRevisionApi.page({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...query,
    } as PageSelectListDto & KnowledgeRevisionQuery);

    let rows: ReviewRow[] = pageData.records;
    await resolveKnowledgeNames(rows);
    rows = rows.map((r) => ({
      ...r,
      knowledgeName: itemNameMap.value[r.knowledgeId] || `#${r.knowledgeId}`,
    }));

    if (knowledgeName.trim()) {
      const keyword = knowledgeName.trim().toLowerCase();
      rows = rows.filter((r) => (r.knowledgeName || '').toLowerCase().includes(keyword));
    }

    tableData.value = rows;
    pagination.total = knowledgeName.trim() ? rows.length : pageData.total;
    if (current.value) {
      const still = rows.find((r) => r.id === current.value?.id);
      current.value = still || null;
    }
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : t('G2_MSG_LOAD_FAIL', '加载列表失败'));
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};
const handleReset = () => {
  baseQueryForm.value = {};
  queryForm.knowledgeName = '';
  queryForm.revisionNo = '';
  queryForm.revisionStatus = 'REVIEWING';
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

const onSelectRow = async (row: ReviewRow | null) => {
  if (!row) {
    current.value = null;
    return;
  }
  detailLoading.value = true;
  try {
    const latest = await KnowledgeRevisionApi.getById(row.id);
    current.value = {
      ...latest,
      knowledgeName: itemNameMap.value[latest.knowledgeId] || row.knowledgeName,
    };
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '加载详情失败');
  } finally {
    detailLoading.value = false;
  }
};

const downloadSource = async () => {
  if (!current.value) return;
  try {
    await KnowledgeRevisionApi.downloadSource(
      current.value.id,
      current.value.sourceFileName || 'source',
    );
  } catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : '下载失败');
  }
};

const approveReview = async () => {
  if (!current.value) return;
  try {
    const latest = await KnowledgeRevisionApi.getById(current.value.id);
    await ElMessageBox.confirm(`确认通过版本「${latest.revisionNo}」？`, '审核通过', { type: 'warning' });
    await KnowledgeRevisionApi.approveReview({
      revisionId: latest.id,
      expectedVersion: latest.version,
    });
    ElMessage.success('审核已通过，等待处理。下一站：知识处理');
    current.value = null;
    await loadData();
  } catch (error: unknown) {
    if (error === 'cancel' || error === 'close') return;
    showErrorMessage(error instanceof Error ? error.message : '审核失败');
  }
};

const rejectReview = async () => {
  if (!current.value) return;
  try {
    const { value } = await ElMessageBox.prompt('请填写驳回意见（必填）', '审核驳回', {
      inputType: 'textarea',
      inputValidator: (v) => (!!v && !!v.trim()) || '驳回意见必填',
      confirmButtonText: '驳回',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const latest = await KnowledgeRevisionApi.getById(current.value.id);
    await KnowledgeRevisionApi.rejectReview({
      revisionId: latest.id,
      expectedVersion: latest.version,
      comment: value.trim(),
    });
    ElMessage.success('已驳回，内容返回草稿。可在知识内容中继续修改');
    current.value = null;
    await loadData();
  } catch (error: unknown) {
    if (error === 'cancel' || error === 'close') return;
    showErrorMessage(error instanceof Error ? error.message : '驳回失败');
  }
};

onMounted(async () => {
  try {
    tagOptions.value = await KnowledgeTagApi.list({ status: 'ACTIVE' });
  } catch {
    tagOptions.value = [];
  }
  await loadData();
});
</script>

<style scoped>
.knowledge_review-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.knowledge_review-page__search {
  margin-bottom: 12px;
  background-color: var(--g2-bg-container);
}
.knowledge_review-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_review-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.knowledge_review-page__body {
  flex: 1;
  min-height: 420px;
  display: grid;
  grid-template-columns: minmax(360px, 1.1fr) minmax(360px, 1fr);
  gap: 12px;
}
.knowledge_review-page__list,
.knowledge_review-page__detail {
  background: var(--g2-bg-container);
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
}
.knowledge_review-page__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.detail-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.detail-toolbar h3 {
  margin: 0;
  font-size: 16px;
}
.block-text {
  white-space: pre-wrap;
  margin: 0;
  font-family: inherit;
}
.field-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
@media (max-width: 960px) {
  .knowledge_review-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
