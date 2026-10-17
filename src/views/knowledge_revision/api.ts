/**
 * 知识版本表相关 API 服务
 * 提供知识版本表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@runtime/http';
import type { KnowledgeRevision, KnowledgeRevisionPayload, KnowledgeRevisionQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * 知识版本表 API 服务类
 */
export class KnowledgeRevisionApi {
  /**
   * 获取知识版本表列表
   * @param params 查询参数（可选）
   * @returns 知识版本表列表
   */
  static async list(params?: KnowledgeRevisionQuery): Promise<KnowledgeRevision[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeRevision[]>('/knowledge/knowledge_revision/list', params);
    return res.data || [];
  }

  /**
   * 分页查询知识版本表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: KnowledgeRevisionQuery & PageSelectListDto): Promise<PageData<KnowledgeRevision>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeRevision>>('/knowledge/knowledge_revision/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 知识版本表 ID
   * @returns 知识版本表详情
   */
  static async getById(id: number): Promise<KnowledgeRevision> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeRevision>(`/knowledge/knowledge_revision/${id}`);
    return res.data;
  }

  /**
   * 保存知识版本表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 知识版本表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的知识版本表
   */
  static async save(payload: KnowledgeRevisionPayload): Promise<KnowledgeRevision> {
    const http = getHttpClient('default');
    const res = await http.post<KnowledgeRevision>('/knowledge/knowledge_revision/save', payload);
    return res.data;
  }

  /**
   * 删除知识版本表
   * @param id 知识版本表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_revision/${id}`);
  }
}

