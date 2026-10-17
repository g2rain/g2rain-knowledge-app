/**
 * 知识切片清单表相关 Mock 数据
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
 * 生成符合 KnowledgeChunk 类型的 Mock 数据模板
 */
function getKnowledgeChunkTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'revisionId': '@integer(1, 100)',
            'chunkNo': '@integer(1, 100)',
            'parentChunkNo': '@integer(1, 100)',
            'sourceLocator|1': ['@word(3,10)', '@word(3,10)'],
            'titlePath|1': ['@word(3,10)', null],
            'pageStart': '@integer(1, 100)',
            'pageEnd': '@integer(1, 100)',
            'tokenCount': '@integer(1, 100)',
            'contentSha256|1': ['@word(3,10)', '@word(3,10)'],
            'chunkStatus|1': ['@word(3,10)', '@word(3,10)'],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 知识切片清单表相关的 Mock 数据映射
 */
export const KnowledgeChunkMockDataMap: MockDataMap = {
  // GET /knowledge_chunk - 根据条件查询列表
  '/knowledge_chunk': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const revisionId = query?.revisionId;
    const chunkNo = query?.chunkNo;
    const parentChunkNo = query?.parentChunkNo;
    const sourceLocator = query?.sourceLocator;
    const titlePath = query?.titlePath;
    const pageStart = query?.pageStart;
    const pageEnd = query?.pageEnd;
    const tokenCount = query?.tokenCount;
    const contentSha256 = query?.contentSha256;
    const chunkStatus = query?.chunkStatus;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeChunkTemplate({
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
    if (revisionId) {
      filteredList = filteredList.filter((item: any) => {
                return item.revisionId === revisionId;
              });
    }
    if (chunkNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.chunkNo === chunkNo;
              });
    }
    if (parentChunkNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.parentChunkNo === parentChunkNo;
              });
    }
    if (sourceLocator) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceLocator && item.sourceLocator.includes(sourceLocator);
              });
    }
    if (titlePath) {
      filteredList = filteredList.filter((item: any) => {
                return item.titlePath && item.titlePath.includes(titlePath);
              });
    }
    if (pageStart) {
      filteredList = filteredList.filter((item: any) => {
                return item.pageStart === pageStart;
              });
    }
    if (pageEnd) {
      filteredList = filteredList.filter((item: any) => {
                return item.pageEnd === pageEnd;
              });
    }
    if (tokenCount) {
      filteredList = filteredList.filter((item: any) => {
                return item.tokenCount === tokenCount;
              });
    }
    if (contentSha256) {
      filteredList = filteredList.filter((item: any) => {
                return item.contentSha256 && item.contentSha256.includes(contentSha256);
              });
    }
    if (chunkStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.chunkStatus && item.chunkStatus.includes(chunkStatus);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_chunk/list - 根据条件查询列表（兼容接口）
  '/knowledge_chunk/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const revisionId = query?.revisionId;
    const chunkNo = query?.chunkNo;
    const parentChunkNo = query?.parentChunkNo;
    const sourceLocator = query?.sourceLocator;
    const titlePath = query?.titlePath;
    const pageStart = query?.pageStart;
    const pageEnd = query?.pageEnd;
    const tokenCount = query?.tokenCount;
    const contentSha256 = query?.contentSha256;
    const chunkStatus = query?.chunkStatus;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeChunkTemplate({
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
    if (revisionId) {
      filteredList = filteredList.filter((item: any) => {
                return item.revisionId === revisionId;
              });
    }
    if (chunkNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.chunkNo === chunkNo;
              });
    }
    if (parentChunkNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.parentChunkNo === parentChunkNo;
              });
    }
    if (sourceLocator) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceLocator && item.sourceLocator.includes(sourceLocator);
              });
    }
    if (titlePath) {
      filteredList = filteredList.filter((item: any) => {
                return item.titlePath && item.titlePath.includes(titlePath);
              });
    }
    if (pageStart) {
      filteredList = filteredList.filter((item: any) => {
                return item.pageStart === pageStart;
              });
    }
    if (pageEnd) {
      filteredList = filteredList.filter((item: any) => {
                return item.pageEnd === pageEnd;
              });
    }
    if (tokenCount) {
      filteredList = filteredList.filter((item: any) => {
                return item.tokenCount === tokenCount;
              });
    }
    if (contentSha256) {
      filteredList = filteredList.filter((item: any) => {
                return item.contentSha256 && item.contentSha256.includes(contentSha256);
              });
    }
    if (chunkStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.chunkStatus && item.chunkStatus.includes(chunkStatus);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_chunk/page - 根据条件分页查询
  '/knowledge_chunk/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const revisionId = query?.query?.revisionId || query?.revisionId;
    const chunkNo = query?.query?.chunkNo || query?.chunkNo;
    const parentChunkNo = query?.query?.parentChunkNo || query?.parentChunkNo;
    const sourceLocator = query?.query?.sourceLocator || query?.sourceLocator;
    const titlePath = query?.query?.titlePath || query?.titlePath;
    const pageStart = query?.query?.pageStart || query?.pageStart;
    const pageEnd = query?.query?.pageEnd || query?.pageEnd;
    const tokenCount = query?.query?.tokenCount || query?.tokenCount;
    const contentSha256 = query?.query?.contentSha256 || query?.contentSha256;
    const chunkStatus = query?.query?.chunkStatus || query?.chunkStatus;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeChunkTemplate()],
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

  // POST /knowledge_chunk/save - 保存（新增或更新）
  '/knowledge_chunk/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识切片清单表数据
    const KnowledgeChunkItem = Mock.mock(
      getKnowledgeChunkTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        revisionId: payload.revisionId !== undefined ? payload.revisionId : '@integer(1, 100)',
        chunkNo: payload.chunkNo !== undefined ? payload.chunkNo : '@integer(1, 100)',
        parentChunkNo: payload.parentChunkNo !== undefined ? payload.parentChunkNo : null,
        sourceLocator: payload.sourceLocator !== undefined ? payload.sourceLocator : '@word(3,10)',
        titlePath: payload.titlePath !== undefined ? payload.titlePath : null,
        pageStart: payload.pageStart !== undefined ? payload.pageStart : null,
        pageEnd: payload.pageEnd !== undefined ? payload.pageEnd : null,
        tokenCount: payload.tokenCount !== undefined ? payload.tokenCount : null,
        contentSha256: payload.contentSha256 !== undefined ? payload.contentSha256 : '@word(3,10)',
        chunkStatus: payload.chunkStatus !== undefined ? payload.chunkStatus : '@word(3,10)',
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeChunkItem);
  },

  // DELETE /knowledge_chunk/:id - 删除
  '/knowledge_chunk/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeChunkMockDataMap);

