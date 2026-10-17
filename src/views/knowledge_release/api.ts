/**
 * 知识发布 API
 */

import { getHttpClient } from '@runtime/http';
import { getEntityById } from '@shared/knowledge/entity';
import type {
  KnowledgeRelease,
  KnowledgeReleasePayload,
  KnowledgeReleaseQuery,
  KnowledgeReleasePublishPayload,
} from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

export class KnowledgeReleaseApi {
  static async list(params?: KnowledgeReleaseQuery): Promise<KnowledgeRelease[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeRelease[]>('/knowledge/knowledge_release/list', params);
    return res.data || [];
  }

  static async page(
    params: KnowledgeReleaseQuery & PageSelectListDto,
  ): Promise<PageData<KnowledgeRelease>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeRelease>>('/knowledge/knowledge_release/page', params);
    return res.data;
  }

  static async getById(id: number): Promise<KnowledgeRelease> {
    return getEntityById((params) => this.list(params), id, '发布记录');
  }

  static async save(payload: KnowledgeReleasePayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_release/save', payload);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_release/${id}`);
  }

  static async publish(payload: KnowledgeReleasePublishPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_release/publish', payload);
    return res.data;
  }

  static async rollback(payload: KnowledgeReleasePublishPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_release/rollback', payload);
    return res.data;
  }
}
