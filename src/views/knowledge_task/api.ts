/**
 * 知识解析与索引处理任务表相关 API 服务
 * 提供知识解析与索引处理任务表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@runtime/http';
import type { KnowledgeTask, KnowledgeTaskPayload, KnowledgeTaskQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * 知识解析与索引处理任务表 API 服务类
 */
export class KnowledgeTaskApi {
  /**
   * 获取知识解析与索引处理任务表列表
   * @param params 查询参数（可选）
   * @returns 知识解析与索引处理任务表列表
   */
  static async list(params?: KnowledgeTaskQuery): Promise<KnowledgeTask[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeTask[]>('/knowledge/knowledge_task/list', params);
    return res.data || [];
  }

  /**
   * 分页查询知识解析与索引处理任务表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: KnowledgeTaskQuery & PageSelectListDto): Promise<PageData<KnowledgeTask>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeTask>>('/knowledge/knowledge_task/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 知识解析与索引处理任务表 ID
   * @returns 知识解析与索引处理任务表详情
   */
  static async getById(id: number): Promise<KnowledgeTask> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeTask>(`/knowledge/knowledge_task/${id}`);
    return res.data;
  }

  /**
   * 保存知识解析与索引处理任务表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 知识解析与索引处理任务表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的知识解析与索引处理任务表
   */
  static async save(payload: KnowledgeTaskPayload): Promise<KnowledgeTask> {
    const http = getHttpClient('default');
    const res = await http.post<KnowledgeTask>('/knowledge/knowledge_task/save', payload);
    return res.data;
  }

  /**
   * 删除知识解析与索引处理任务表
   * @param id 知识解析与索引处理任务表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_task/${id}`);
  }
}

