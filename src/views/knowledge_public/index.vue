<template>
  <div class="knowledge_public-page">
    <div class="knowledge_public-page__header">
      <h2>公共知识</h2>
      <el-tag type="success">跨机构只读</el-tag>
    </div>

    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="never">
          <template #header>分类导航</template>
          <el-menu :default-active="String(selectedCategoryId ?? '')" @select="onCategorySelect">
            <el-menu-item index="">全部</el-menu-item>
            <el-menu-item
              v-for="cat in categories"
              :key="`${cat.organId}-${cat.categoryId}`"
              :index="String(cat.categoryId)"
            >
              <span>{{ cat.categoryName || cat.categoryId }}</span>
              <span class="muted">（{{ cat.organId }} · {{ cat.knowledgeCount }}）</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never">
          <div class="toolbar">
            <el-input v-model="keyword" clearable placeholder="关键词" style="width: 240px" @keyup.enter="loadPage" />
            <el-button type="primary" :loading="loading" @click="loadPage">查询</el-button>
          </div>
          <el-table :data="rows" v-loading="loading" stripe>
            <el-table-column prop="knowledgeName" label="名称" min-width="160" />
            <el-table-column prop="organId" label="机构ID" width="120" />
            <el-table-column prop="categoryId" label="分类ID" width="120" />
            <el-table-column prop="revisionNo" label="版本" width="100" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openDetail(row)">详情</el-button>
                <el-button link type="primary" @click="openBody(row)">阅读</el-button>
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

    <el-drawer v-model="detailOpen" size="40%" title="公共知识详情">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="名称">{{ detail.knowledgeName }}</el-descriptions-item>
        <el-descriptions-item label="知识ID">{{ detail.knowledgeId }}</el-descriptions-item>
        <el-descriptions-item label="机构ID">{{ detail.organId }}</el-descriptions-item>
        <el-descriptions-item label="分类ID">{{ detail.categoryId }}</el-descriptions-item>
        <el-descriptions-item label="版本">{{ detail.revisionNo }}</el-descriptions-item>
        <el-descriptions-item label="说明">{{ detail.description || '-' }}</el-descriptions-item>
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

const loadCategories = async () => {
  categories.value = await KnowledgePublicApi.categories();
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
.knowledge_public-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
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
