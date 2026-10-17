/**
 * 视图路由映射（模板项目）
 *
 * 仅注册「模板内已有」的示例页面，不包含具体业务系统的页面。
 * 从本模板生成新项目后，在此补充 views 下的页面与 linkPath 的映射即可。
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

/** 路由路径 -> 视图配置
 * 模板默认不包含任何「system」示例页面。
 * 你可以在子应用生成后按需补充 `views/*` 并在这里注册。
 */
export const routeMap: Record<string, ViewRouteConfig> = {
    '/knowledge_category': {
            component: () => import('@/views/knowledge_category/index.vue'),
            name: 'KnowledgeCategory',
            meta: { title: '知识分类表', requiresAuth: true, showInHome: true },
        },
    '/knowledge_tag': {
            component: () => import('@/views/knowledge_tag/index.vue'),
            name: 'KnowledgeTag',
            meta: { title: '知识标签字典表', requiresAuth: true, showInHome: true },
        },
    '/knowledge_item': {
            component: () => import('@/views/knowledge_item/index.vue'),
            name: 'KnowledgeItem',
            meta: { title: '知识主题表', requiresAuth: true, showInHome: true },
        },
    '/knowledge_revision': {
            component: () => import('@/views/knowledge_revision/index.vue'),
            name: 'KnowledgeRevision',
            meta: { title: '知识版本表', requiresAuth: true, showInHome: true },
        },
    '/knowledge_chunk': {
            component: () => import('@/views/knowledge_chunk/index.vue'),
            name: 'KnowledgeChunk',
            meta: { title: '知识切片清单表', requiresAuth: true, showInHome: true },
        },
    '/knowledge_task': {
            component: () => import('@/views/knowledge_task/index.vue'),
            name: 'KnowledgeTask',
            meta: { title: '知识解析与索引处理任务表', requiresAuth: true, showInHome: true },
        },
    '/knowledge_release': {
            component: () => import('@/views/knowledge_release/index.vue'),
            name: 'KnowledgeRelease',
            meta: { title: '知识发布选择表', requiresAuth: true, showInHome: true },
        },
    '/knowledge_answer_template': {
            component: () => import('@/views/knowledge_answer_template/index.vue'),
            name: 'KnowledgeAnswerTemplate',
            meta: { title: '知识回复模板表', requiresAuth: true, showInHome: true },
        }
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
