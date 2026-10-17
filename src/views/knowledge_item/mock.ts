/**
 * 知识主题表相关 Mock 数据
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
 * 生成符合 KnowledgeItem 类型的 Mock 数据模板
 */
function getKnowledgeItemTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'categoryId': '@integer(1, 100)',
            'knowledgeKey|1': ['@word(3,10)', '@word(3,10)'],
            'knowledgeName|1': ['@word(3,10)', '@word(3,10)'],
            'knowledgeType|1': ['@word(3,10)', '@word(3,10)'],
            'status|1': ['@word(3,10)', '@word(3,10)'],
            'description|1': ['@word(3,10)', null],
            'createUserId': '@integer(1, 100)',
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 知识主题表相关的 Mock 数据映射
 */
export const KnowledgeItemMockDataMap: MockDataMap = {
  // GET /knowledge_item - 根据条件查询列表
  '/knowledge_item': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const categoryId = query?.categoryId;
    const knowledgeKey = query?.knowledgeKey;
    const knowledgeName = query?.knowledgeName;
    const knowledgeType = query?.knowledgeType;
    const status = query?.status;
    const description = query?.description;
    const createUserId = query?.createUserId;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeItemTemplate({
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
    if (categoryId) {
      filteredList = filteredList.filter((item: any) => {
                return item.categoryId === categoryId;
              });
    }
    if (knowledgeKey) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeKey && item.knowledgeKey.includes(knowledgeKey);
              });
    }
    if (knowledgeName) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeName && item.knowledgeName.includes(knowledgeName);
              });
    }
    if (knowledgeType) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeType && item.knowledgeType.includes(knowledgeType);
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }
    if (createUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.createUserId === createUserId;
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_item/list - 根据条件查询列表（兼容接口）
  '/knowledge_item/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const categoryId = query?.categoryId;
    const knowledgeKey = query?.knowledgeKey;
    const knowledgeName = query?.knowledgeName;
    const knowledgeType = query?.knowledgeType;
    const status = query?.status;
    const description = query?.description;
    const createUserId = query?.createUserId;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeItemTemplate({
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
    if (categoryId) {
      filteredList = filteredList.filter((item: any) => {
                return item.categoryId === categoryId;
              });
    }
    if (knowledgeKey) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeKey && item.knowledgeKey.includes(knowledgeKey);
              });
    }
    if (knowledgeName) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeName && item.knowledgeName.includes(knowledgeName);
              });
    }
    if (knowledgeType) {
      filteredList = filteredList.filter((item: any) => {
                return item.knowledgeType && item.knowledgeType.includes(knowledgeType);
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }
    if (description) {
      filteredList = filteredList.filter((item: any) => {
                return item.description && item.description.includes(description);
              });
    }
    if (createUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.createUserId === createUserId;
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_item/page - 根据条件分页查询
  '/knowledge_item/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const categoryId = query?.query?.categoryId || query?.categoryId;
    const knowledgeKey = query?.query?.knowledgeKey || query?.knowledgeKey;
    const knowledgeName = query?.query?.knowledgeName || query?.knowledgeName;
    const knowledgeType = query?.query?.knowledgeType || query?.knowledgeType;
    const status = query?.query?.status || query?.status;
    const description = query?.query?.description || query?.description;
    const createUserId = query?.query?.createUserId || query?.createUserId;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeItemTemplate()],
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

  // POST /knowledge_item/save - 保存（新增或更新）
  '/knowledge_item/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识主题表数据
    const KnowledgeItemItem = Mock.mock(
      getKnowledgeItemTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        categoryId: payload.categoryId !== undefined ? payload.categoryId : null,
        knowledgeKey: payload.knowledgeKey !== undefined ? payload.knowledgeKey : '@word(3,10)',
        knowledgeName: payload.knowledgeName !== undefined ? payload.knowledgeName : '@word(3,10)',
        knowledgeType: payload.knowledgeType !== undefined ? payload.knowledgeType : '@word(3,10)',
        status: payload.status !== undefined ? payload.status : '@word(3,10)',
        description: payload.description !== undefined ? payload.description : null,
        createUserId: payload.createUserId !== undefined ? payload.createUserId : null,
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeItemItem);
  },

  // DELETE /knowledge_item/:id - 删除
  '/knowledge_item/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeItemMockDataMap);

