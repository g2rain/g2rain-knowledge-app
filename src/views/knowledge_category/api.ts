/**
 * 知识分类 API
 */

import { getHttpClient } from '@runtime/http';
import { getEntityById } from '@shared/knowledge/entity';
import type { KnowledgeCategory, KnowledgeCategoryPayload, KnowledgeCategoryQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

export class KnowledgeCategoryApi {
  static async list(params?: KnowledgeCategoryQuery): Promise<KnowledgeCategory[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeCategory[]>('/knowledge/knowledge_category/list', params);
    return res.data || [];
  }

  static async page(
    params: KnowledgeCategoryQuery & PageSelectListDto,
  ): Promise<PageData<KnowledgeCategory>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeCategory>>('/knowledge/knowledge_category/page', params);
    return res.data;
  }

  static async getById(id: number): Promise<KnowledgeCategory> {
    return getEntityById((params) => this.list(params), id, '知识分类');
  }

  static async save(payload: KnowledgeCategoryPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_category/save', payload);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_category/${id}`);
  }
}
