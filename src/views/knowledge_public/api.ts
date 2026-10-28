import { getHttpClient } from '@runtime/http';
import type { PageData } from '@platform/types/api.type';
import type { KnowledgePublicBody, KnowledgePublicCategory, KnowledgePublicItem } from './type';

export class KnowledgePublicApi {
  static async page(params: {
    categoryId?: number;
    keyword?: string;
    pageNum?: number;
    pageSize?: number;
  }): Promise<PageData<KnowledgePublicItem>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgePublicItem>>('/knowledge/knowledge/public/page', params);
    return res.data;
  }

  static async categories(): Promise<KnowledgePublicCategory[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgePublicCategory[]>('/knowledge/knowledge/public/categories');
    return res.data || [];
  }

  static async detail(knowledgeId: number): Promise<KnowledgePublicItem> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgePublicItem>(`/knowledge/knowledge/public/${knowledgeId}`);
    return res.data;
  }

  static async body(knowledgeId: number): Promise<KnowledgePublicBody> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgePublicBody>(`/knowledge/knowledge/public/${knowledgeId}/body`);
    return res.data;
  }
}
