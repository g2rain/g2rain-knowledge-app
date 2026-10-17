/**
 * 知识版本表相关 Mock 数据
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
 * 生成符合 KnowledgeRevision 类型的 Mock 数据模板
 */
function getKnowledgeRevisionTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'knowledgeId': '@integer(1, 100)',
            'revisionNo|1': ['@word(3,10)', '@word(3,10)'],
            'sourceType|1': ['@word(3,10)', '@word(3,10)'],
            'revisionStatus|1': ['@word(3,10)', '@word(3,10)'],
            'sourceFileName|1': ['@word(3,10)', null],
            'sourceContentType|1': ['@word(3,10)', null],
            'sourceStoragePath|1': ['@word(3,10)', null],
            'sourceSha256|1': ['@word(3,10)', null],
            'sourceFileSize': '@integer(1, 100)',
            'faqQuestion|1': ['@word(3,10)', null],
            'faqAnswer|1': ['@word(3,10)', null],
            'parserName|1': ['@word(3,10)', null],
            'parserVersion|1': ['@word(3,10)', null],
            'parserTaskId|1': ['@word(3,10)', null],
            'parsedStoragePath|1': ['@word(3,10)', null],
            'chunkCount': '@integer(1, 100)',
            'indexStatus|1': ['@word(3,10)', '@word(3,10)'],
            'embeddingProfile|1': ['@word(3,10)', null],
            'embeddingModel|1': ['@word(3,10)', null],
            'indexCompletedTime|1': ['@word(3,10)', null],
            'priority': '@integer(1, 100)',
            'tagsJson|1': ['@word(3,10)', null],
            'reviewerUserId': '@integer(1, 100)',
            'reviewTime|1': ['@word(3,10)', null],
            'reviewComment|1': ['@word(3,10)', null],
            'createUserId': '@integer(1, 100)',
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 知识版本表相关的 Mock 数据映射
 */
export const KnowledgeRevisionMockDataMap: MockDataMap = {
  // GET /knowledge_revision - 根据条件查询列表
  '/knowledge_revision': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const knowledgeId = query?.knowledgeId;
    const revisionNo = query?.revisionNo;
    const sourceType = query?.sourceType;
    const revisionStatus = query?.revisionStatus;
    const sourceFileName = query?.sourceFileName;
    const sourceContentType = query?.sourceContentType;
    const sourceStoragePath = query?.sourceStoragePath;
    const sourceSha256 = query?.sourceSha256;
    const sourceFileSize = query?.sourceFileSize;
    const faqQuestion = query?.faqQuestion;
    const faqAnswer = query?.faqAnswer;
    const parserName = query?.parserName;
    const parserVersion = query?.parserVersion;
    const parserTaskId = query?.parserTaskId;
    const parsedStoragePath = query?.parsedStoragePath;
    const chunkCount = query?.chunkCount;
    const indexStatus = query?.indexStatus;
    const embeddingProfile = query?.embeddingProfile;
    const embeddingModel = query?.embeddingModel;
    const indexCompletedTime = query?.indexCompletedTime;
    const priority = query?.priority;
    const tagsJson = query?.tagsJson;
    const reviewerUserId = query?.reviewerUserId;
    const reviewTime = query?.reviewTime;
    const reviewComment = query?.reviewComment;
    const createUserId = query?.createUserId;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeRevisionTemplate({
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
    if (revisionNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.revisionNo && item.revisionNo.includes(revisionNo);
              });
    }
    if (sourceType) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceType && item.sourceType.includes(sourceType);
              });
    }
    if (revisionStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.revisionStatus && item.revisionStatus.includes(revisionStatus);
              });
    }
    if (sourceFileName) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceFileName && item.sourceFileName.includes(sourceFileName);
              });
    }
    if (sourceContentType) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceContentType && item.sourceContentType.includes(sourceContentType);
              });
    }
    if (sourceStoragePath) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceStoragePath && item.sourceStoragePath.includes(sourceStoragePath);
              });
    }
    if (sourceSha256) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceSha256 && item.sourceSha256.includes(sourceSha256);
              });
    }
    if (sourceFileSize) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceFileSize === sourceFileSize;
              });
    }
    if (faqQuestion) {
      filteredList = filteredList.filter((item: any) => {
                return item.faqQuestion && item.faqQuestion.includes(faqQuestion);
              });
    }
    if (faqAnswer) {
      filteredList = filteredList.filter((item: any) => {
                return item.faqAnswer && item.faqAnswer.includes(faqAnswer);
              });
    }
    if (parserName) {
      filteredList = filteredList.filter((item: any) => {
                return item.parserName && item.parserName.includes(parserName);
              });
    }
    if (parserVersion) {
      filteredList = filteredList.filter((item: any) => {
                return item.parserVersion && item.parserVersion.includes(parserVersion);
              });
    }
    if (parserTaskId) {
      filteredList = filteredList.filter((item: any) => {
                return item.parserTaskId && item.parserTaskId.includes(parserTaskId);
              });
    }
    if (parsedStoragePath) {
      filteredList = filteredList.filter((item: any) => {
                return item.parsedStoragePath && item.parsedStoragePath.includes(parsedStoragePath);
              });
    }
    if (chunkCount) {
      filteredList = filteredList.filter((item: any) => {
                return item.chunkCount === chunkCount;
              });
    }
    if (indexStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.indexStatus && item.indexStatus.includes(indexStatus);
              });
    }
    if (embeddingProfile) {
      filteredList = filteredList.filter((item: any) => {
                return item.embeddingProfile && item.embeddingProfile.includes(embeddingProfile);
              });
    }
    if (embeddingModel) {
      filteredList = filteredList.filter((item: any) => {
                return item.embeddingModel && item.embeddingModel.includes(embeddingModel);
              });
    }
    if (indexCompletedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.indexCompletedTime && item.indexCompletedTime.includes(indexCompletedTime);
              });
    }
    if (priority) {
      filteredList = filteredList.filter((item: any) => {
                return item.priority === priority;
              });
    }
    if (tagsJson) {
      filteredList = filteredList.filter((item: any) => {
                return item.tagsJson && item.tagsJson.includes(tagsJson);
              });
    }
    if (reviewerUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.reviewerUserId === reviewerUserId;
              });
    }
    if (reviewTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.reviewTime && item.reviewTime.includes(reviewTime);
              });
    }
    if (reviewComment) {
      filteredList = filteredList.filter((item: any) => {
                return item.reviewComment && item.reviewComment.includes(reviewComment);
              });
    }
    if (createUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.createUserId === createUserId;
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_revision/list - 根据条件查询列表（兼容接口）
  '/knowledge_revision/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const knowledgeId = query?.knowledgeId;
    const revisionNo = query?.revisionNo;
    const sourceType = query?.sourceType;
    const revisionStatus = query?.revisionStatus;
    const sourceFileName = query?.sourceFileName;
    const sourceContentType = query?.sourceContentType;
    const sourceStoragePath = query?.sourceStoragePath;
    const sourceSha256 = query?.sourceSha256;
    const sourceFileSize = query?.sourceFileSize;
    const faqQuestion = query?.faqQuestion;
    const faqAnswer = query?.faqAnswer;
    const parserName = query?.parserName;
    const parserVersion = query?.parserVersion;
    const parserTaskId = query?.parserTaskId;
    const parsedStoragePath = query?.parsedStoragePath;
    const chunkCount = query?.chunkCount;
    const indexStatus = query?.indexStatus;
    const embeddingProfile = query?.embeddingProfile;
    const embeddingModel = query?.embeddingModel;
    const indexCompletedTime = query?.indexCompletedTime;
    const priority = query?.priority;
    const tagsJson = query?.tagsJson;
    const reviewerUserId = query?.reviewerUserId;
    const reviewTime = query?.reviewTime;
    const reviewComment = query?.reviewComment;
    const createUserId = query?.createUserId;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeRevisionTemplate({
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
    if (revisionNo) {
      filteredList = filteredList.filter((item: any) => {
                return item.revisionNo && item.revisionNo.includes(revisionNo);
              });
    }
    if (sourceType) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceType && item.sourceType.includes(sourceType);
              });
    }
    if (revisionStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.revisionStatus && item.revisionStatus.includes(revisionStatus);
              });
    }
    if (sourceFileName) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceFileName && item.sourceFileName.includes(sourceFileName);
              });
    }
    if (sourceContentType) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceContentType && item.sourceContentType.includes(sourceContentType);
              });
    }
    if (sourceStoragePath) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceStoragePath && item.sourceStoragePath.includes(sourceStoragePath);
              });
    }
    if (sourceSha256) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceSha256 && item.sourceSha256.includes(sourceSha256);
              });
    }
    if (sourceFileSize) {
      filteredList = filteredList.filter((item: any) => {
                return item.sourceFileSize === sourceFileSize;
              });
    }
    if (faqQuestion) {
      filteredList = filteredList.filter((item: any) => {
                return item.faqQuestion && item.faqQuestion.includes(faqQuestion);
              });
    }
    if (faqAnswer) {
      filteredList = filteredList.filter((item: any) => {
                return item.faqAnswer && item.faqAnswer.includes(faqAnswer);
              });
    }
    if (parserName) {
      filteredList = filteredList.filter((item: any) => {
                return item.parserName && item.parserName.includes(parserName);
              });
    }
    if (parserVersion) {
      filteredList = filteredList.filter((item: any) => {
                return item.parserVersion && item.parserVersion.includes(parserVersion);
              });
    }
    if (parserTaskId) {
      filteredList = filteredList.filter((item: any) => {
                return item.parserTaskId && item.parserTaskId.includes(parserTaskId);
              });
    }
    if (parsedStoragePath) {
      filteredList = filteredList.filter((item: any) => {
                return item.parsedStoragePath && item.parsedStoragePath.includes(parsedStoragePath);
              });
    }
    if (chunkCount) {
      filteredList = filteredList.filter((item: any) => {
                return item.chunkCount === chunkCount;
              });
    }
    if (indexStatus) {
      filteredList = filteredList.filter((item: any) => {
                return item.indexStatus && item.indexStatus.includes(indexStatus);
              });
    }
    if (embeddingProfile) {
      filteredList = filteredList.filter((item: any) => {
                return item.embeddingProfile && item.embeddingProfile.includes(embeddingProfile);
              });
    }
    if (embeddingModel) {
      filteredList = filteredList.filter((item: any) => {
                return item.embeddingModel && item.embeddingModel.includes(embeddingModel);
              });
    }
    if (indexCompletedTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.indexCompletedTime && item.indexCompletedTime.includes(indexCompletedTime);
              });
    }
    if (priority) {
      filteredList = filteredList.filter((item: any) => {
                return item.priority === priority;
              });
    }
    if (tagsJson) {
      filteredList = filteredList.filter((item: any) => {
                return item.tagsJson && item.tagsJson.includes(tagsJson);
              });
    }
    if (reviewerUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.reviewerUserId === reviewerUserId;
              });
    }
    if (reviewTime) {
      filteredList = filteredList.filter((item: any) => {
                return item.reviewTime && item.reviewTime.includes(reviewTime);
              });
    }
    if (reviewComment) {
      filteredList = filteredList.filter((item: any) => {
                return item.reviewComment && item.reviewComment.includes(reviewComment);
              });
    }
    if (createUserId) {
      filteredList = filteredList.filter((item: any) => {
                return item.createUserId === createUserId;
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_revision/page - 根据条件分页查询
  '/knowledge_revision/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const knowledgeId = query?.query?.knowledgeId || query?.knowledgeId;
    const revisionNo = query?.query?.revisionNo || query?.revisionNo;
    const sourceType = query?.query?.sourceType || query?.sourceType;
    const revisionStatus = query?.query?.revisionStatus || query?.revisionStatus;
    const sourceFileName = query?.query?.sourceFileName || query?.sourceFileName;
    const sourceContentType = query?.query?.sourceContentType || query?.sourceContentType;
    const sourceStoragePath = query?.query?.sourceStoragePath || query?.sourceStoragePath;
    const sourceSha256 = query?.query?.sourceSha256 || query?.sourceSha256;
    const sourceFileSize = query?.query?.sourceFileSize || query?.sourceFileSize;
    const faqQuestion = query?.query?.faqQuestion || query?.faqQuestion;
    const faqAnswer = query?.query?.faqAnswer || query?.faqAnswer;
    const parserName = query?.query?.parserName || query?.parserName;
    const parserVersion = query?.query?.parserVersion || query?.parserVersion;
    const parserTaskId = query?.query?.parserTaskId || query?.parserTaskId;
    const parsedStoragePath = query?.query?.parsedStoragePath || query?.parsedStoragePath;
    const chunkCount = query?.query?.chunkCount || query?.chunkCount;
    const indexStatus = query?.query?.indexStatus || query?.indexStatus;
    const embeddingProfile = query?.query?.embeddingProfile || query?.embeddingProfile;
    const embeddingModel = query?.query?.embeddingModel || query?.embeddingModel;
    const indexCompletedTime = query?.query?.indexCompletedTime || query?.indexCompletedTime;
    const priority = query?.query?.priority || query?.priority;
    const tagsJson = query?.query?.tagsJson || query?.tagsJson;
    const reviewerUserId = query?.query?.reviewerUserId || query?.reviewerUserId;
    const reviewTime = query?.query?.reviewTime || query?.reviewTime;
    const reviewComment = query?.query?.reviewComment || query?.reviewComment;
    const createUserId = query?.query?.createUserId || query?.createUserId;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeRevisionTemplate()],
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

  // POST /knowledge_revision/save - 保存（新增或更新）
  '/knowledge_revision/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识版本表数据
    const KnowledgeRevisionItem = Mock.mock(
      getKnowledgeRevisionTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        knowledgeId: payload.knowledgeId !== undefined ? payload.knowledgeId : '@integer(1, 100)',
        revisionNo: payload.revisionNo !== undefined ? payload.revisionNo : '@word(3,10)',
        sourceType: payload.sourceType !== undefined ? payload.sourceType : '@word(3,10)',
        revisionStatus: payload.revisionStatus !== undefined ? payload.revisionStatus : '@word(3,10)',
        sourceFileName: payload.sourceFileName !== undefined ? payload.sourceFileName : null,
        sourceContentType: payload.sourceContentType !== undefined ? payload.sourceContentType : null,
        sourceStoragePath: payload.sourceStoragePath !== undefined ? payload.sourceStoragePath : null,
        sourceSha256: payload.sourceSha256 !== undefined ? payload.sourceSha256 : null,
        sourceFileSize: payload.sourceFileSize !== undefined ? payload.sourceFileSize : null,
        faqQuestion: payload.faqQuestion !== undefined ? payload.faqQuestion : null,
        faqAnswer: payload.faqAnswer !== undefined ? payload.faqAnswer : null,
        parserName: payload.parserName !== undefined ? payload.parserName : null,
        parserVersion: payload.parserVersion !== undefined ? payload.parserVersion : null,
        parserTaskId: payload.parserTaskId !== undefined ? payload.parserTaskId : null,
        parsedStoragePath: payload.parsedStoragePath !== undefined ? payload.parsedStoragePath : null,
        chunkCount: payload.chunkCount !== undefined ? payload.chunkCount : '@integer(1, 100)',
        indexStatus: payload.indexStatus !== undefined ? payload.indexStatus : '@word(3,10)',
        embeddingProfile: payload.embeddingProfile !== undefined ? payload.embeddingProfile : null,
        embeddingModel: payload.embeddingModel !== undefined ? payload.embeddingModel : null,
        indexCompletedTime: payload.indexCompletedTime !== undefined ? payload.indexCompletedTime : null,
        priority: payload.priority !== undefined ? payload.priority : '@integer(1, 100)',
        tagsJson: payload.tagsJson !== undefined ? payload.tagsJson : null,
        reviewerUserId: payload.reviewerUserId !== undefined ? payload.reviewerUserId : null,
        reviewTime: payload.reviewTime !== undefined ? payload.reviewTime : null,
        reviewComment: payload.reviewComment !== undefined ? payload.reviewComment : null,
        createUserId: payload.createUserId !== undefined ? payload.createUserId : null,
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeRevisionItem);
  },

  // DELETE /knowledge_revision/:id - 删除
  '/knowledge_revision/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeRevisionMockDataMap);

