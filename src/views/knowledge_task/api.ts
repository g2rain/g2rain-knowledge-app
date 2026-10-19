/**
 * 知识处理任务 API
 */

import { getHttpClient } from '@runtime/http';
import { getEntityById } from '@shared/knowledge/entity';
import type {
  KnowledgeTask,
  KnowledgeTaskPayload,
  KnowledgeTaskQuery,
  KnowledgeTaskActionPayload,
} from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

export class KnowledgeTaskApi {
  static async list(params?: KnowledgeTaskQuery): Promise<KnowledgeTask[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeTask[]>('/knowledge/knowledge_task/list', params);
    return res.data || [];
  }

  static async page(params: KnowledgeTaskQuery & PageSelectListDto): Promise<PageData<KnowledgeTask>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeTask>>('/knowledge/knowledge_task/page', params);
    return res.data;
  }

  static async getById(id: number): Promise<KnowledgeTask> {
    return getEntityById((params) => this.list(params), id, '处理任务');
  }

  static async save(payload: KnowledgeTaskPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_task/save', payload);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_task/${id}`);
  }

  static async startProcess(revisionId: number): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>(`/knowledge/knowledge_task/process/${revisionId}`);
    return res.data;
  }

  static async retry(payload: KnowledgeTaskActionPayload): Promise<void> {
    const http = getHttpClient('default');
    await http.post('/knowledge/knowledge_task/retry', payload);
  }

  static async cancel(payload: KnowledgeTaskActionPayload): Promise<void> {
    const http = getHttpClient('default');
    await http.post('/knowledge/knowledge_task/cancel', payload);
  }
}
