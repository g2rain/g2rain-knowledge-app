/**
 * 知识发布选择表相关 API 服务
 * 提供知识发布选择表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@runtime/http';
import type { KnowledgeRelease, KnowledgeReleasePayload, KnowledgeReleaseQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * 知识发布选择表 API 服务类
 */
export class KnowledgeReleaseApi {
  /**
   * 获取知识发布选择表列表
   * @param params 查询参数（可选）
   * @returns 知识发布选择表列表
   */
  static async list(params?: KnowledgeReleaseQuery): Promise<KnowledgeRelease[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeRelease[]>('/knowledge/knowledge_release/list', params);
    return res.data || [];
  }

  /**
   * 分页查询知识发布选择表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: KnowledgeReleaseQuery & PageSelectListDto): Promise<PageData<KnowledgeRelease>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeRelease>>('/knowledge/knowledge_release/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 知识发布选择表 ID
   * @returns 知识发布选择表详情
   */
  static async getById(id: number): Promise<KnowledgeRelease> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeRelease>(`/knowledge/knowledge_release/${id}`);
    return res.data;
  }

  /**
   * 保存知识发布选择表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 知识发布选择表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的知识发布选择表
   */
  static async save(payload: KnowledgeReleasePayload): Promise<KnowledgeRelease> {
    const http = getHttpClient('default');
    const res = await http.post<KnowledgeRelease>('/knowledge/knowledge_release/save', payload);
    return res.data;
  }

  /**
   * 删除知识发布选择表
   * @param id 知识发布选择表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_release/${id}`);
  }
}

