/**
 * 知识分类表相关 API 服务
 * 提供知识分类表数据的 CRUD 操作接口
 */

import { getHttpClient } from '@runtime/http';
import type { KnowledgeCategory, KnowledgeCategoryPayload, KnowledgeCategoryQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

// 导入 mock 数据以触发自动注册（副作用导入）
import './mock';

/**
 * 知识分类表 API 服务类
 */
export class KnowledgeCategoryApi {
  /**
   * 获取知识分类表列表
   * @param params 查询参数（可选）
   * @returns 知识分类表列表
   */
  static async list(params?: KnowledgeCategoryQuery): Promise<KnowledgeCategory[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeCategory[]>('/knowledge/knowledge_category/list', params);
    return res.data || [];
  }

  /**
   * 分页查询知识分类表列表
   * @param params 查询参数（继承PageSelectListDto，包含基础查询和业务查询条件）
   * @returns 分页数据
   */
  static async page(params: KnowledgeCategoryQuery & PageSelectListDto): Promise<PageData<KnowledgeCategory>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeCategory>>('/knowledge/knowledge_category/page', params);
    return res.data;
  }

  /**
   * 按 ID 查询单条明细
   * @param id 知识分类表 ID
   * @returns 知识分类表详情
   */
  static async getById(id: number): Promise<KnowledgeCategory> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeCategory>(`/knowledge/knowledge_category/${id}`);
    return res.data;
  }

  /**
   * 保存知识分类表（新增或更新）
   * 如果 payload 中包含 id，则为更新；否则为新增
   * @param payload 知识分类表数据（包含 id 时为更新，不包含时为新增）
   * @returns 保存后的知识分类表
   */
  static async save(payload: KnowledgeCategoryPayload): Promise<KnowledgeCategory> {
    const http = getHttpClient('default');
    const res = await http.post<KnowledgeCategory>('/knowledge/knowledge_category/save', payload);
    return res.data;
  }

  /**
   * 删除知识分类表
   * @param id 知识分类表 ID
   */
  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_category/${id}`);
  }
}

