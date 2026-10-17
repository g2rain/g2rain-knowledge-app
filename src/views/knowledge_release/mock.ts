/**
 * 知识发布选择表相关 Mock 数据
 */

import type { AxiosRequestConfig } from 'axios';
import type { Result } from '@g2rain/http';
import { mockManager, type MockDataMap } from '@runtime/http';
import Mock from 'mockjs';

/**
 * 生成符合 Result 格式的响应
 */
function createResult<T>(data: T, status: number = 200): Result<T> {
  // 先使用 Mock.mock 生成元数据，然后直接设置 data，避免 data 被 mock 处理
  const result = Mock.mock({
    requestId: '@guid',
    requestTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    status,
    errorCode: status === 200 ? '' : '@word(5,10)',
    errorMessage: status === 200 ? '' : '@cword(5,15)',
  }) as Result<T>;
  
  // 直接设置 data，不经过 Mock.mock 处理
  result.data = data;
  
  return result;
}

/**
 * 生成符合 KnowledgeRelease 类型的 Mock 数据模板
 */
function getKnowledgeReleaseTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'knowledgeId': '@integer(1, 100)',
            'activeRevisionId': '@integer(1, 100)',
            'releaseStatus|1': ['@word(3,10)', '@word(3,10)'],
            'publishedUserId': '@integer(1, 100)',
            'publishedTime|1': ['@word(3,10)', null],
            'releaseReason|1': ['@word(3,10)', null],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 知识发布选择表相关的 Mock 数据映射
 */
export const KnowledgeReleaseMockDataMap: MockDataMap = {
  // GET /knowledge_release - 根据条件查询列表
  '/knowledge_release': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const knowledgeId = query?.knowledgeId;
    const activeRevisionId = query?.activeRevisionId;
    const releaseStatus = query?.releaseStatus;
    const publishedUserId = query?.publishedUserId;
    const publishedTime = query?.publishedTime;
    const releaseReason = query?.releaseReason;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeReleaseTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (organId) {
      filteredList = filteredList.filter((item: any) => {
                return item.organId === organId;
              });
    }
    if (knowledgeId) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeId === knowledgeId;
              });
    }
    if (activeRevisionId) {
      filteredList = filteredList.filter((item: any) => {
                return item.activeRevisionId === activeRevisionId;
              });
    }
    if (releaseStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.releaseStatus && item.releaseStatus.includes(releaseStatus);
              });
    }
    if (publishedUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.publishedUserId === publishedUserId;
              });
    }
    if (publishedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.publishedTime && item.publishedTime.includes(publishedTime);
              });
    }
    if (releaseReason) {
      filteredList = filteredList.filter((item: any) => {
                return item.releaseReason && item.releaseReason.includes(releaseReason);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_release/list - 根据条件查询列表（兼容接口）
  '/knowledge_release/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const knowledgeId = query?.knowledgeId;
    const activeRevisionId = query?.activeRevisionId;
    const releaseStatus = query?.releaseStatus;
    const publishedUserId = query?.publishedUserId;
    const publishedTime = query?.publishedTime;
    const releaseReason = query?.releaseReason;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeReleaseTemplate({
          id: i + 1,
        }),
      );
      list.push(item);
    }

    let filteredList = list;
    if (organId) {
      filteredList = filteredList.filter((item: any) => {
                return item.organId === organId;
              });
    }
    if (knowledgeId) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeId === knowledgeId;
              });
    }
    if (activeRevisionId) {
      filteredList = filteredList.filter((item: any) => {
                return item.activeRevisionId === activeRevisionId;
              });
    }
    if (releaseStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.releaseStatus && item.releaseStatus.includes(releaseStatus);
              });
    }
    if (publishedUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.publishedUserId === publishedUserId;
              });
    }
    if (publishedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.publishedTime && item.publishedTime.includes(publishedTime);
              });
    }
    if (releaseReason) {
      filteredList = filteredList.filter((item: any) => {
                return item.releaseReason && item.releaseReason.includes(releaseReason);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_release/page - 根据条件分页查询
  '/knowledge_release/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const knowledgeId = query?.query?.knowledgeId || query?.knowledgeId;
    const activeRevisionId = query?.query?.activeRevisionId || query?.activeRevisionId;
    const releaseStatus = query?.query?.releaseStatus || query?.releaseStatus;
    const publishedUserId = query?.query?.publishedUserId || query?.publishedUserId;
    const publishedTime = query?.query?.publishedTime || query?.publishedTime;
    const releaseReason = query?.query?.releaseReason || query?.releaseReason;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeReleaseTemplate()],
    };

    const result = Mock.mock(template);

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    const pageData = {
      pageNum,
      pageSize,
      total,
      totalPages,
      records: result.records,
    };

    return createResult(pageData);
  },

  // POST /knowledge_release/save - 保存（新增或更新）
  '/knowledge_release/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识发布选择表数据
    const KnowledgeReleaseItem = Mock.mock(
      getKnowledgeReleaseTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        knowledgeId: payload.knowledgeId !== undefined ? payload.knowledgeId : '@integer(1, 100)',
        activeRevisionId: payload.activeRevisionId !== undefined ? payload.activeRevisionId : null,
        releaseStatus: payload.releaseStatus !== undefined ? payload.releaseStatus : '@word(3,10)',
        publishedUserId: payload.publishedUserId !== undefined ? payload.publishedUserId : null,
        publishedTime: payload.publishedTime !== undefined ? payload.publishedTime : null,
        releaseReason: payload.releaseReason !== undefined ? payload.releaseReason : null,
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeReleaseItem);
  },

  // DELETE /knowledge_release/:id - 删除
  '/knowledge_release/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeReleaseMockDataMap);

