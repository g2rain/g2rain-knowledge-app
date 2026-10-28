/**
 * 视图路由映射
 */

export interface ViewRouteConfig {
  component: () => Promise<unknown>;
  name?: string;
  meta: {
    title: string;
    requiresAuth: boolean;
    showInHome?: boolean;
  };
}

export const routeMap: Record<string, ViewRouteConfig> = {
  '/knowledge_item': {
    component: () => import('@/views/knowledge_item/index.vue'),
    name: 'KnowledgeItem',
    meta: { title: '本机构知识', requiresAuth: true, showInHome: true },
  },
  '/knowledge_public': {
    component: () => import('@/views/knowledge_public/index.vue'),
    name: 'KnowledgePublic',
    meta: { title: '公共知识', requiresAuth: true, showInHome: true },
  },
  '/knowledge_review': {
    component: () => import('@/views/knowledge_review/index.vue'),
    name: 'KnowledgeReview',
    meta: { title: '内容审核', requiresAuth: true, showInHome: true },
  },
  '/knowledge_task': {
    component: () => import('@/views/knowledge_task/index.vue'),
    name: 'KnowledgeTask',
    meta: { title: '知识处理', requiresAuth: true, showInHome: true },
  },
  '/knowledge_release': {
    component: () => import('@/views/knowledge_release/index.vue'),
    name: 'KnowledgeRelease',
    meta: { title: '发布管理', requiresAuth: true, showInHome: true },
  },
  '/knowledge_search': {
    component: () => import('@/views/knowledge_search/index.vue'),
    name: 'KnowledgeSearch',
    meta: { title: '效果验证', requiresAuth: true, showInHome: true },
  },
  '/knowledge_category': {
    component: () => import('@/views/knowledge_category/index.vue'),
    name: 'KnowledgeCategory',
    meta: { title: '分类管理', requiresAuth: true, showInHome: true },
  },
  '/knowledge_tag': {
    component: () => import('@/views/knowledge_tag/index.vue'),
    name: 'KnowledgeTag',
    meta: { title: '标签管理', requiresAuth: true, showInHome: true },
  },
  '/knowledge_answer_template': {
    component: () => import('@/views/knowledge_answer_template/index.vue'),
    name: 'KnowledgeAnswerTemplate',
    meta: { title: '回复模板', requiresAuth: true, showInHome: true },
  },
  // 历史入口：保留组件映射以便旧链接可提示迁移，不进入首页
  '/knowledge_revision': {
    component: () => import('@/views/knowledge_revision/index.vue'),
    name: 'KnowledgeRevision',
    meta: { title: '版本管理（已迁移）', requiresAuth: true, showInHome: false },
  },
  '/knowledge_chunk': {
    component: () => import('@/views/knowledge_chunk/index.vue'),
    name: 'KnowledgeChunk',
    meta: { title: '切片清单（已迁移）', requiresAuth: true, showInHome: false },
  },
};

export function getRouteComponent(
  routePath: string,
): (() => Promise<unknown>) | undefined {
  return routeMap[routePath]?.component;
}

export function getHomeRoutes(): Array<{ path: string; title: string; name?: string }> {
  return Object.entries(routeMap)
    .filter(([path, config]) => {
      if (path === '/' || path === '/home') {
        return false;
      }
      return config.meta.showInHome === true;
    })
    .map(([path, config]) => ({
      path,
      title: config.meta.title,
      name: config.name,
    }));
}
