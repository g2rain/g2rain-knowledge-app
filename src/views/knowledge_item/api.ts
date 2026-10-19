/**
 * 知识主题 API
 */

import { getHttpClient } from '@runtime/http';
import { getEntityById } from '@shared/knowledge/entity';
import type { KnowledgeItem, KnowledgeItemPayload, KnowledgeItemQuery } from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

export class KnowledgeItemApi {
  static async list(params?: KnowledgeItemQuery): Promise<KnowledgeItem[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeItem[]>('/knowledge/knowledge_item/list', params);
    return res.data || [];
  }

  static async page(params: KnowledgeItemQuery & PageSelectListDto): Promise<PageData<KnowledgeItem>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeItem>>('/knowledge/knowledge_item/page', params);
    return res.data;
  }

  static async getById(id: number): Promise<KnowledgeItem> {
    return getEntityById((params) => this.list(params), id, '知识主题');
  }

  /** 后端 save 返回 ID */
  static async save(payload: KnowledgeItemPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_item/save', payload);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_item/${id}`);
  }
}
