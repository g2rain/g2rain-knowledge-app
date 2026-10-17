/**
 * 知识分类表相关 Mock 数据
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
 * 生成符合 KnowledgeCategory 类型的 Mock 数据模板
 */
function getKnowledgeCategoryTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'categoryCode|1': ['@word(3,10)', '@word(3,10)'],
            'categoryName|1': ['@word(3,10)', '@word(3,10)'],
            'status|1': ['@word(3,10)', '@word(3,10)'],
            'sortOrder': '@integer(1, 100)',
            'remark|1': ['@word(3,10)', null],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 知识分类表相关的 Mock 数据映射
 */
export const KnowledgeCategoryMockDataMap: MockDataMap = {
  // GET /knowledge_category - 根据条件查询列表
  '/knowledge_category': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const categoryCode = query?.categoryCode;
    const categoryName = query?.categoryName;
    const status = query?.status;
    const sortOrder = query?.sortOrder;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeCategoryTemplate({
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
    if (categoryCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.categoryCode && item.categoryCode.includes(categoryCode);
              });
    }
    if (categoryName) {
      filteredList = filteredList.filter((item: any) => {
                return item.categoryName && item.categoryName.includes(categoryName);
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }
    if (sortOrder) {
      filteredList = filteredList.filter((item: any) => {
                return item.sortOrder === sortOrder;
              });
    }
    if (remark) {
      filteredList = filteredList.filter((item: any) => {
                return item.remark && item.remark.includes(remark);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_category/list - 根据条件查询列表（兼容接口）
  '/knowledge_category/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const categoryCode = query?.categoryCode;
    const categoryName = query?.categoryName;
    const status = query?.status;
    const sortOrder = query?.sortOrder;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeCategoryTemplate({
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
    if (categoryCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.categoryCode && item.categoryCode.includes(categoryCode);
              });
    }
    if (categoryName) {
      filteredList = filteredList.filter((item: any) => {
                return item.categoryName && item.categoryName.includes(categoryName);
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }
    if (sortOrder) {
      filteredList = filteredList.filter((item: any) => {
                return item.sortOrder === sortOrder;
              });
    }
    if (remark) {
      filteredList = filteredList.filter((item: any) => {
                return item.remark && item.remark.includes(remark);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_category/page - 根据条件分页查询
  '/knowledge_category/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const categoryCode = query?.query?.categoryCode || query?.categoryCode;
    const categoryName = query?.query?.categoryName || query?.categoryName;
    const status = query?.query?.status || query?.status;
    const sortOrder = query?.query?.sortOrder || query?.sortOrder;
    const remark = query?.query?.remark || query?.remark;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeCategoryTemplate()],
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

  // POST /knowledge_category/save - 保存（新增或更新）
  '/knowledge_category/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识分类表数据
    const KnowledgeCategoryItem = Mock.mock(
      getKnowledgeCategoryTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        categoryCode: payload.categoryCode !== undefined ? payload.categoryCode : '@word(3,10)',
        categoryName: payload.categoryName !== undefined ? payload.categoryName : '@word(3,10)',
        status: payload.status !== undefined ? payload.status : '@word(3,10)',
        sortOrder: payload.sortOrder !== undefined ? payload.sortOrder : '@integer(1, 100)',
        remark: payload.remark !== undefined ? payload.remark : null,
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeCategoryItem);
  },

  // DELETE /knowledge_category/:id - 删除
  '/knowledge_category/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeCategoryMockDataMap);

