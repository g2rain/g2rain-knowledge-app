<template>
  <div class="knowledge_public-page">
    <div class="knowledge_public-page__header">
      <h2>{{ $t('KN_PUBLIC_TITLE', '公共知识') }}</h2>
      <el-tag type="success">{{ $t('KN_PUBLIC_TAG_READONLY', '跨机构只读') }}</el-tag>
    </div>

    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="never">
          <template #header>{{ $t('KN_PUBLIC_NAV', '分类导航') }}</template>
          <el-menu :default-active="String(selectedCategoryId ?? '')" @select="onCategorySelect">
            <el-menu-item index="">{{ $t('KN_PUBLIC_ALL', '全部') }}</el-menu-item>
            <el-menu-item
              v-for="cat in categories"
              :key="`${cat.organId}-${cat.categoryId}`"
              :index="String(cat.categoryId)"
            >
              <span>{{ cat.categoryName || cat.categoryId }}</span>
              <span class="muted">（{{ organName(cat) }} · {{ cat.knowledgeCount }}）</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never">
          <div class="toolbar">
            <el-input v-model="keyword" clearable :placeholder="$t('KN_PUBLIC_PH_KEYWORD', '关键词')" style="width: 240px" @keyup.enter="loadPage" />
            <el-button type="primary" :loading="loading" @click="loadPage">{{ $t('G2_BTN_QUERY', '查询') }}</el-button>
          </div>
          <el-table :data="rows" v-loading="loading" stripe>
            <el-table-column prop="knowledgeName" :label="$t('G2_FIELD_NAME', '名称')" min-width="160" />
            <el-table-column :label="$t('G2_FIELD_ORGAN', '所属机构')" width="140" show-overflow-tooltip>
              <template #default="{ row }">{{ organName(row) }}</template>
            </el-table-column>
            <el-table-column :label="$t('G2_FIELD_CATEGORY', '分类')" width="120">
              <template #default="{ row }">{{ categoryLabel(row.categoryId) }}</template>
            </el-table-column>
            <el-table-column prop="revisionNo" :label="$t('G2_FIELD_VERSION', '版本号')" width="100" />
            <el-table-column :label="$t('G2_FIELD_ACTION', '操作')" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openDetail(row)">{{ $t('G2_BTN_DETAIL', '详情') }}</el-button>
                <el-button link type="primary" @click="openBody(row)">{{ $t('KN_PUBLIC_BTN_READ', '阅读') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pager">
            <el-pagination
              v-model:current-page="pageNum"
              v-model:page-size="pageSize"
              :total="total"
              layout="total, prev, pager, next"
              @current-change="loadPage"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="detailOpen" size="40%" :title="$t('KN_PUBLIC_DETAIL', '公共知识详情')">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item :label="$t('G2_FIELD_NAME', '名称')">{{ detail.knowledgeName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_ID', 'ID')">{{ detail.knowledgeId }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_ORGAN', '所属机构')">{{ organName(detail) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_CATEGORY', '分类')">{{ categoryLabel(detail.categoryId) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_VERSION', '版本号')">{{ detail.revisionNo }}</el-descriptions-item>
        <el-descriptions-item :label="$t('G2_FIELD_DESCRIPTION', '说明')">{{ detail.description || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-drawer v-model="drawerOpen" size="50%" :title="drawerTitle">
      <pre class="body-text">{{ drawerBody }}</pre>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { KnowledgePublicApi } from './api';
import type { KnowledgePublicCategory, KnowledgePublicItem } from './type';
import { ensureOrganNames, organName } from '@shared/knowledge/organ-name';

const loading = ref(false);
const keyword = ref('');
const pageNum = ref(1);
const pageSize = ref(20);
const total = ref(0);
const rows = ref<KnowledgePublicItem[]>([]);
const categories = ref<KnowledgePublicCategory[]>([]);
const selectedCategoryId = ref<number | undefined>();
const drawerOpen = ref(false);
const drawerTitle = ref('');
const drawerBody = ref('');
const detailOpen = ref(false);
const detail = ref<KnowledgePublicItem | null>(null);

const categoryLabel = (categoryId?: number) =>
  categories.value.find((c) => c.categoryId === categoryId)?.categoryName || categoryId || '-';

const loadCategories = async () => {
  categories.value = await KnowledgePublicApi.categories();
  await ensureOrganNames(categories.value);
};

const loadPage = async () => {
  loading.value = true;
  try {
    const page = await KnowledgePublicApi.page({
      categoryId: selectedCategoryId.value,
      keyword: keyword.value || undefined,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    });
    rows.value = page?.records || [];
    total.value = Number(page?.total || 0);
    await ensureOrganNames(rows.value);
  } finally {
    loading.value = false;
  }
};

const onCategorySelect = (index: string) => {
  selectedCategoryId.value = index ? Number(index) : undefined;
  pageNum.value = 1;
  loadPage();
};

const openDetail = async (row: KnowledgePublicItem) => {
  detail.value = await KnowledgePublicApi.detail(row.knowledgeId);
  if (detail.value) await ensureOrganNames([detail.value]);
  detailOpen.value = true;
};

const openBody = async (row: KnowledgePublicItem) => {
  const body = await KnowledgePublicApi.body(row.knowledgeId);
  drawerTitle.value = body.title || row.knowledgeName || '正文';
  drawerBody.value = body.content || '';
  drawerOpen.value = true;
};

onMounted(async () => {
  await loadCategories();
  await loadPage();
});
</script>

<style scoped>
.knowledge_public-page {
  padding: 20px;
  background-color: var(--g2-bg-page);
  min-height: 100%;
  box-sizing: border-box;
}
.knowledge_public-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
  background-color: var(--g2-bg-container);
  border-radius: 4px;
}
.knowledge_public-page__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.pager {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.muted {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.body-text {
  white-space: pre-wrap;
  font-family: inherit;
  line-height: 1.6;
}
</style>
