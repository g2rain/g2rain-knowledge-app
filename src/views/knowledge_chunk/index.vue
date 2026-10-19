<template>
  <div class="migrated-page">
    <el-result icon="info" title="切片入口已迁移" sub-title="请在知识内容 → 版本详情 →「切片」页签中查看。">
      <template #extra>
        <el-button type="primary" @click="goItem">进入知识内容</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const goItem = () => router.push('/knowledge_item');
</script>

<style scoped>
.migrated-page {
  padding: 48px 20px;
  background: var(--g2-bg-page);
  min-height: 100%;
  box-sizing: border-box;
}
</style>
