/**
 * 知识标签 API
 */

import { getHttpClient } from '@runtime/http';
import { getEntityById } from '@shared/knowledge/entity';
import type { KnowledgeTag, KnowledgeTagPayload, KnowledgeTagQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

export class KnowledgeTagApi {
  static async list(params?: KnowledgeTagQuery): Promise<KnowledgeTag[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeTag[]>('/knowledge/knowledge_tag/list', params);
    return res.data || [];
  }

  static async page(params: KnowledgeTagQuery & PageSelectListDto): Promise<PageData<KnowledgeTag>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeTag>>('/knowledge/knowledge_tag/page', params);
    return res.data;
  }

  static async getById(id: number): Promise<KnowledgeTag> {
    return getEntityById((params) => this.list(params), id, '知识标签');
  }

  static async save(payload: KnowledgeTagPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_tag/save', payload);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_tag/${id}`);
  }
}
