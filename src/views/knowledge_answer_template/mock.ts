/**
 * 知识回复模板表相关 Mock 数据
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
 * 生成符合 KnowledgeAnswerTemplate 类型的 Mock 数据模板
 */
function getKnowledgeAnswerTemplateTemplate(overrides: Partial<any> = {}): any {
  return {
    'id|+1': 1,
        'organId': '@integer(1, 100)',
            'templateCode|1': ['@word(3,10)', '@word(3,10)'],
            'templateName|1': ['@word(3,10)', '@word(3,10)'],
            'systemPrompt|1': ['@word(3,10)', '@word(3,10)'],
            'status|1': ['@word(3,10)', '@word(3,10)'],
            'remark|1': ['@word(3,10)', null],
        version: '@integer(1, 100)',
    createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    ...overrides,
  };
}

/**
 * 知识回复模板表相关的 Mock 数据映射
 */
export const KnowledgeAnswerTemplateMockDataMap: MockDataMap = {
  // GET /knowledge_answer_template - 根据条件查询列表
  '/knowledge_answer_template': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const templateCode = query?.templateCode;
    const templateName = query?.templateName;
    const systemPrompt = query?.systemPrompt;
    const status = query?.status;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeAnswerTemplateTemplate({
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
    if (templateCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.templateCode && item.templateCode.includes(templateCode);
              });
    }
    if (templateName) {
      filteredList = filteredList.filter((item: any) => {
                return item.templateName && item.templateName.includes(templateName);
              });
    }
    if (systemPrompt) {
      filteredList = filteredList.filter((item: any) => {
                return item.systemPrompt && item.systemPrompt.includes(systemPrompt);
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }
    if (remark) {
      filteredList = filteredList.filter((item: any) => {
                return item.remark && item.remark.includes(remark);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_answer_template/list - 根据条件查询列表（兼容接口）
  '/knowledge_answer_template/list': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const organId = query?.organId;
    const templateCode = query?.templateCode;
    const templateName = query?.templateName;
    const systemPrompt = query?.systemPrompt;
    const status = query?.status;
    const remark = query?.remark;

    const count = 15;

    const list: any[] = [];
    for (let i = 0; i < count; i++) {
      const item = Mock.mock(
        getKnowledgeAnswerTemplateTemplate({
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
    if (templateCode) {
      filteredList = filteredList.filter((item: any) => {
                return item.templateCode && item.templateCode.includes(templateCode);
              });
    }
    if (templateName) {
      filteredList = filteredList.filter((item: any) => {
                return item.templateName && item.templateName.includes(templateName);
              });
    }
    if (systemPrompt) {
      filteredList = filteredList.filter((item: any) => {
                return item.systemPrompt && item.systemPrompt.includes(systemPrompt);
              });
    }
    if (status) {
      filteredList = filteredList.filter((item: any) => {
                return item.status && item.status.includes(status);
              });
    }
    if (remark) {
      filteredList = filteredList.filter((item: any) => {
                return item.remark && item.remark.includes(remark);
              });
    }

    return createResult(filteredList);
  },

  // GET /knowledge_answer_template/page - 根据条件分页查询
  '/knowledge_answer_template/page': (config: AxiosRequestConfig) => {
    const query = config.params || {};
    const pageNum = parseInt(query?.pageNum || query?.page || '1', 10);
    const pageSize = parseInt(query?.pageSize || query?.size || '10', 10);
    const organId = query?.query?.organId || query?.organId;
    const templateCode = query?.query?.templateCode || query?.templateCode;
    const templateName = query?.query?.templateName || query?.templateName;
    const systemPrompt = query?.query?.systemPrompt || query?.systemPrompt;
    const status = query?.query?.status || query?.status;
    const remark = query?.query?.remark || query?.remark;

    const total = 50;
    const count = Math.min(pageSize, total - (pageNum - 1) * pageSize);
    const template: any = {
      [`records|${count}`]: [getKnowledgeAnswerTemplateTemplate()],
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

  // POST /knowledge_answer_template/save - 保存（新增或更新）
  '/knowledge_answer_template/save': (config: AxiosRequestConfig) => {
    const payload = config.data || {};
    const isUpdate = payload.id !== undefined && payload.id !== null;
    
    // 如果是更新，使用传入的 id；如果是新增，生成新 id
    const id = isUpdate ? payload.id : Mock.Random.integer(1000, 9999);
    
    // 生成完整的知识回复模板表数据
    const KnowledgeAnswerTemplateItem = Mock.mock(
      getKnowledgeAnswerTemplateTemplate({
        id,
        organId: payload.organId !== undefined ? payload.organId : '@integer(1, 100)',
        templateCode: payload.templateCode !== undefined ? payload.templateCode : '@word(3,10)',
        templateName: payload.templateName !== undefined ? payload.templateName : '@word(3,10)',
        systemPrompt: payload.systemPrompt !== undefined ? payload.systemPrompt : '@word(3,10)',
        status: payload.status !== undefined ? payload.status : '@word(3,10)',
        remark: payload.remark !== undefined ? payload.remark : null,
        updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        createTime: isUpdate ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '@datetime("yyyy-MM-dd HH:mm:ss")',
      }),
    );
    
    return createResult(KnowledgeAnswerTemplateItem);
  },

  // DELETE /knowledge_answer_template/:id - 删除
  '/knowledge_answer_template/:id': (config: AxiosRequestConfig) => {
    const deletedRows = 1;
    return createResult(deletedRows);
  },
};

// 模块加载时自动注册到 mockManager
mockManager.registerAll(KnowledgeAnswerTemplateMockDataMap);

