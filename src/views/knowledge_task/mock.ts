/**
 * 知识解析与索引处理任务表相关 Mock 数据
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
 * 生成符合 KnowledgeTask 类型的 Mock 数据模板
 */
function getKnowledgeTaskTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'revisionId': '@integer(1, 100)',
            'taskType|1': ['@word(3,10)', '@word(3,10)'],
            'taskStatus|1': ['@word(3,10)', '@word(3,10)'],
            'idempotencyKey|1': ['@word(3,10)', '@word(3,10)'],
            'inputSnapshot|1': ['@word(3,10)', null],
            'attemptNo': '@integer(1, 100)',
            'availableTime|1': ['@word(3,10)', '@word(3,10)'],
            'leaseOwner|1': ['@word(3,10)', null],
            'leaseExpireTime|1': ['@word(3,10)', null],
            'leaseGeneration': '@integer(1, 100)',
            'cancelRequested': '@integer(1, 100)',
            'providerName|1': ['@word(3,10)', null],
            'modelName|1': ['@word(3,10)', null],
            'traceId|1': ['@word(3,10)', null],
            'startedTime|1': ['@word(3,10)', null],
            'finishedTime|1': ['@word(3,10)', null],
            'errorCode|1': ['@word(3,10)', null],
            'errorSummary|1': ['@word(3,10)', null],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 知识解析与索引处理任务表相关的 Mock 数据映射
 */
export const KnowledgeTaskMockDataMap: MockDataMap = {
  // GET /knowledge_task - 根据条件查询列表
  '/knowledge_task': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const revisionId = query?.revisionId;
    const taskType = query?.taskType;
    const taskStatus = query?.taskStatus;
    const idempotencyKey = query?.idempotencyKey;
    const inputSnapshot = query?.inputSnapshot;
    const attemptNo = query?.attemptNo;
    const availableTime = query?.availableTime;
    const leaseOwner = query?.leaseOwner;
    const leaseExpireTime = query?.leaseExpireTime;
    const leaseGeneration = query?.leaseGeneration;
    const cancelRequested = query?.cancelRequested;
    const providerName = query?.providerName;
    const modelName = query?.modelName;
    const traceId = query?.traceId;
    const startedTime = query?.startedTime;
    const finishedTime = query?.finishedTime;
    const errorCode = query?.errorCode;
    const errorSummary = query?.errorSummary;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeTaskTemplate({
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
    if (taskType) {
      filteredList = filteredList.filter((item: any) => {
                return item.taskType && item.taskType.includes(taskType);
              });
    }
    if (taskStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.taskStatus && item.taskStatus.includes(taskStatus);
              });
    }
    if (idempotencyKey) {
      filteredList = filteredList.filter((item: any) => {
                return item.idempotencyKey && item.idempotencyKey.includes(idempotencyKey);
              });
    }
    if (inputSnapshot) {
      filteredList = filteredList.filter((item: any) => {
                return item.inputSnapshot && item.inputSnapshot.includes(inputSnapshot);
              });
    }
    if (attemptNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.attemptNo === attemptNo;
              });
    }
    if (availableTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.availableTime && item.availableTime.includes(availableTime);
              });
    }
    if (leaseOwner) {
      filteredList = filteredList.filter((item: any) => {
                return item.leaseOwner && item.leaseOwner.includes(leaseOwner);
              });
    }
    if (leaseExpireTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.leaseExpireTime && item.leaseExpireTime.includes(leaseExpireTime);
              });
    }
    if (leaseGeneration) {
      filteredList = filteredList.filter((item: any) => {
                return item.leaseGeneration === leaseGeneration;
              });
    }
    if (cancelRequested) {
      filteredList = filteredList.filter((item: any) => {
                return item.cancelRequested === cancelRequested;
              });
    }
    if (providerName) {
      filteredList = filteredList.filter((item: any) => {
                return item.providerName && item.providerName.includes(providerName);
              });
    }
    if (modelName) {
      filteredList = filteredList.filter((item: any) => {
                return item.modelName && item.modelName.includes(modelName);
              });
    }
    if (traceId) {
      filteredList = filteredList.filter((item: any) => {
                return item.traceId && item.traceId.includes(traceId);
              });
    }
    if (startedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.startedTime && item.startedTime.includes(startedTime);
              });
    }
    if (finishedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.finishedTime && item.finishedTime.includes(finishedTime);
              });
    }
    if (errorCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.errorCode && item.errorCode.includes(errorCode);
              });
    }
    if (errorSummary) {
      filteredList = filteredList.filter((item: any) => {
                return item.errorSummary && item.errorSummary.includes(errorSummary);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_task/list - 根据条件查询列表（兼容接口）
  '/knowledge_task/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const revisionId = query?.revisionId;
    const taskType = query?.taskType;
    const taskStatus = query?.taskStatus;
    const idempotencyKey = query?.idempotencyKey;
    const inputSnapshot = query?.inputSnapshot;
    const attemptNo = query?.attemptNo;
    const availableTime = query?.availableTime;
    const leaseOwner = query?.leaseOwner;
    const leaseExpireTime = query?.leaseExpireTime;
    const leaseGeneration = query?.leaseGeneration;
    const cancelRequested = query?.cancelRequested;
    const providerName = query?.providerName;
    const modelName = query?.modelName;
    const traceId = query?.traceId;
    const startedTime = query?.startedTime;
    const finishedTime = query?.finishedTime;
    const errorCode = query?.errorCode;
    const errorSummary = query?.errorSummary;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeTaskTemplate({
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
    if (taskType) {
      filteredList = filteredList.filter((item: any) => {
                return item.taskType && item.taskType.includes(taskType);
              });
    }
    if (taskStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.taskStatus && item.taskStatus.includes(taskStatus);
              });
    }
    if (idempotencyKey) {
      filteredList = filteredList.filter((item: any) => {
                return item.idempotencyKey && item.idempotencyKey.includes(idempotencyKey);
              });
    }
    if (inputSnapshot) {
      filteredList = filteredList.filter((item: any) => {
                return item.inputSnapshot && item.inputSnapshot.includes(inputSnapshot);
              });
    }
    if (attemptNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.attemptNo === attemptNo;
              });
    }
    if (availableTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.availableTime && item.availableTime.includes(availableTime);
              });
    }
    if (leaseOwner) {
      filteredList = filteredList.filter((item: any) => {
                return item.leaseOwner && item.leaseOwner.includes(leaseOwner);
              });
    }
    if (leaseExpireTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.leaseExpireTime && item.leaseExpireTime.includes(leaseExpireTime);
              });
    }
    if (leaseGeneration) {
      filteredList = filteredList.filter((item: any) => {
                return item.leaseGeneration === leaseGeneration;
              });
    }
    if (cancelRequested) {
      filteredList = filteredList.filter((item: any) => {
                return item.cancelRequested === cancelRequested;
              });
    }
    if (providerName) {
      filteredList = filteredList.filter((item: any) => {
                return item.providerName && item.providerName.includes(providerName);
              });
    }
    if (modelName) {
      filteredList = filteredList.filter((item: any) => {
                return item.modelName && item.modelName.includes(modelName);
              });
    }
    if (traceId) {
      filteredList = filteredList.filter((item: any) => {
                return item.traceId && item.traceId.includes(traceId);
              });
    }
    if (startedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.startedTime && item.startedTime.includes(startedTime);
              });
    }
    if (finishedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.finishedTime && item.finishedTime.includes(finishedTime);
              });
    }
    if (errorCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.errorCode && item.errorCode.includes(errorCode);
              });
    }
    if (errorSummary) {
      filteredList = filteredList.filter((item: any) => {
                return item.errorSummary && item.errorSummary.includes(errorSummary);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_task/page - 根据条件分页查询
  '/knowledge_task/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const revisionId = query?.query?.revisionId || query?.revisionId;
    const taskType = query?.query?.taskType || query?.taskType;
    const taskStatus = query?.query?.taskStatus || query?.taskStatus;
    const idempotencyKey = query?.query?.idempotencyKey || query?.idempotencyKey;
    const inputSnapshot = query?.query?.inputSnapshot || query?.inputSnapshot;
    const attemptNo = query?.query?.attemptNo || query?.attemptNo;
    const availableTime = query?.query?.availableTime || query?.availableTime;
    const leaseOwner = query?.query?.leaseOwner || query?.leaseOwner;
    const leaseExpireTime = query?.query?.leaseExpireTime || query?.leaseExpireTime;
    const leaseGeneration = query?.query?.leaseGeneration || query?.leaseGeneration;
    const cancelRequested = query?.query?.cancelRequested || query?.cancelRequested;
    const providerName = query?.query?.providerName || query?.providerName;
    const modelName = query?.query?.modelName || query?.modelName;
    const traceId = query?.query?.traceId || query?.traceId;
    const startedTime = query?.query?.startedTime || query?.startedTime;
    const finishedTime = query?.query?.finishedTime || query?.finishedTime;
    const errorCode = query?.query?.errorCode || query?.errorCode;
    const errorSummary = query?.query?.errorSummary || query?.errorSummary;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeTaskTemplate()],
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

  // POST /knowledge_task/save - 保存（新增或更新）
  '/knowledge_task/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识解析与索引处理任务表数据
    const KnowledgeTaskItem = Mock.mock(
      getKnowledgeTaskTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        revisionId: payload.revisionId !== undefined ? payload.revisionId : '@integer(1, 100)',
        taskType: payload.taskType !== undefined ? payload.taskType : '@word(3,10)',
        taskStatus: payload.taskStatus !== undefined ? payload.taskStatus : '@word(3,10)',
        idempotencyKey: payload.idempotencyKey !== undefined ? payload.idempotencyKey : '@word(3,10)',
        inputSnapshot: payload.inputSnapshot !== undefined ? payload.inputSnapshot : null,
        attemptNo: payload.attemptNo !== undefined ? payload.attemptNo : '@integer(1, 100)',
        availableTime: payload.availableTime !== undefined ? payload.availableTime : '@word(3,10)',
        leaseOwner: payload.leaseOwner !== undefined ? payload.leaseOwner : null,
        leaseExpireTime: payload.leaseExpireTime !== undefined ? payload.leaseExpireTime : null,
        leaseGeneration: payload.leaseGeneration !== undefined ? payload.leaseGeneration : '@integer(1, 100)',
        cancelRequested: payload.cancelRequested !== undefined ? payload.cancelRequested : '@integer(1, 100)',
        providerName: payload.providerName !== undefined ? payload.providerName : null,
        modelName: payload.modelName !== undefined ? payload.modelName : null,
        traceId: payload.traceId !== undefined ? payload.traceId : null,
        startedTime: payload.startedTime !== undefined ? payload.startedTime : null,
        finishedTime: payload.finishedTime !== undefined ? payload.finishedTime : null,
        errorCode: payload.errorCode !== undefined ? payload.errorCode : null,
        errorSummary: payload.errorSummary !== undefined ? payload.errorSummary : null,
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeTaskItem);
  },

  // DELETE /knowledge_task/:id - 删除
  '/knowledge_task/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeTaskMockDataMap);

