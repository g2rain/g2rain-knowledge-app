/**
 * 知识回复模板 API
 */

import { getHttpClient } from '@runtime/http';
import { getEntityById } from '@shared/knowledge/entity';
import type {
  KnowledgeAnswerTemplate,
  KnowledgeAnswerTemplatePayload,
  KnowledgeAnswerTemplateQuery,
} from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

export class KnowledgeAnswerTemplateApi {
  static async list(params?: KnowledgeAnswerTemplateQuery): Promise<KnowledgeAnswerTemplate[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeAnswerTemplate[]>(
      '/knowledge/knowledge_answer_template/list',
      params,
    );
    return res.data || [];
  }

  static async page(
    params: KnowledgeAnswerTemplateQuery & PageSelectListDto,
  ): Promise<PageData<KnowledgeAnswerTemplate>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeAnswerTemplate>>(
      '/knowledge/knowledge_answer_template/page',
      params,
    );
    return res.data;
  }

  static async getById(id: number): Promise<KnowledgeAnswerTemplate> {
    return getEntityById((params) => this.list(params), id, '回复模板');
  }

  static async save(payload: KnowledgeAnswerTemplatePayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_answer_template/save', payload);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_answer_template/${id}`);
  }
}
