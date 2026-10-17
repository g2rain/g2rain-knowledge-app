/**
 * 知识标签字典表相关 Mock 数据
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
 * 生成符合 KnowledgeTag 类型的 Mock 数据模板
 */
function getKnowledgeTagTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'tagCode|1': ['@word(3,10)', '@word(3,10)'],
            'tagName|1': ['@word(3,10)', '@word(3,10)'],
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
 * 知识标签字典表相关的 Mock 数据映射
 */
export const KnowledgeTagMockDataMap: MockDataMap = {
  // GET /knowledge_tag - 根据条件查询列表
  '/knowledge_tag': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const tagCode = query?.tagCode;
    const tagName = query?.tagName;
    const status = query?.status;
    const sortOrder = query?.sortOrder;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeTagTemplate({
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
    if (tagCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.tagCode && item.tagCode.includes(tagCode);
              });
    }
    if (tagName) {
      filteredList = filteredList.filter((item: any) => {
                return item.tagName && item.tagName.includes(tagName);
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

  // GET /knowledge_tag/list - 根据条件查询列表（兼容接口）
  '/knowledge_tag/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const tagCode = query?.tagCode;
    const tagName = query?.tagName;
    const status = query?.status;
    const sortOrder = query?.sortOrder;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeTagTemplate({
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
    if (tagCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.tagCode && item.tagCode.includes(tagCode);
              });
    }
    if (tagName) {
      filteredList = filteredList.filter((item: any) => {
                return item.tagName && item.tagName.includes(tagName);
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

  // GET /knowledge_tag/page - 根据条件分页查询
  '/knowledge_tag/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const tagCode = query?.query?.tagCode || query?.tagCode;
    const tagName = query?.query?.tagName || query?.tagName;
    const status = query?.query?.status || query?.status;
    const sortOrder = query?.query?.sortOrder || query?.sortOrder;
    const remark = query?.query?.remark || query?.remark;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeTagTemplate()],
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

  // POST /knowledge_tag/save - 保存（新增或更新）
  '/knowledge_tag/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识标签字典表数据
    const KnowledgeTagItem = Mock.mock(
      getKnowledgeTagTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        tagCode: payload.tagCode !== undefined ? payload.tagCode : '@word(3,10)',
        tagName: payload.tagName !== undefined ? payload.tagName : '@word(3,10)',
        status: payload.status !== undefined ? payload.status : '@word(3,10)',
        sortOrder: payload.sortOrder !== undefined ? payload.sortOrder : '@integer(1, 100)',
        remark: payload.remark !== undefined ? payload.remark : null,
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeTagItem);
  },

  // DELETE /knowledge_tag/:id - 删除
  '/knowledge_tag/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeTagMockDataMap);

