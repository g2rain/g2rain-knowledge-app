/**
 * 知识版本 API（含审核、文件替换与下载）
 */

import { getHttpClient } from '@runtime/http';
import { downloadAuthenticatedFile } from '@shared/knowledge/download';
import { getEntityById } from '@shared/knowledge/entity';
import type {
  KnowledgeRevision,
  KnowledgeRevisionPayload,
  KnowledgeRevisionQuery,
  KnowledgeReviewPayload,
} from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

export class KnowledgeRevisionApi {
  static async list(params?: KnowledgeRevisionQuery): Promise<KnowledgeRevision[]> {
    const http = getHttpClient('default');
    const res = await http.get<KnowledgeRevision[]>('/knowledge/knowledge_revision/list', params);
    return res.data || [];
  }

  static async page(
    params: KnowledgeRevisionQuery & PageSelectListDto,
  ): Promise<PageData<KnowledgeRevision>> {
    const http = getHttpClient('default');
    const res = await http.get<PageData<KnowledgeRevision>>('/knowledge/knowledge_revision/page', params);
    return res.data;
  }

  static async getById(id: number): Promise<KnowledgeRevision> {
    return getEntityById((params) => this.list(params), id, '知识版本');
  }

  static async save(payload: KnowledgeRevisionPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_revision/save', payload);
    return res.data;
  }

  static async remove(id: number): Promise<void> {
    const http = getHttpClient('default');
    await http.delete(`/knowledge/knowledge_revision/${id}`);
  }

  static async submitReview(payload: KnowledgeReviewPayload): Promise<void> {
    const http = getHttpClient('default');
    await http.post('/knowledge/knowledge_revision/review/submit', payload);
  }

  static async approveReview(payload: KnowledgeReviewPayload): Promise<number> {
    const http = getHttpClient('default');
    const res = await http.post<number>('/knowledge/knowledge_revision/review/approve', payload);
    return res.data;
  }

  static async rejectReview(payload: KnowledgeReviewPayload): Promise<void> {
    const http = getHttpClient('default');
    await http.post('/knowledge/knowledge_revision/review/reject', payload);
  }

  static async replaceFile(revisionId: number, expectedVersion: number, file: File): Promise<void> {
    const http = getHttpClient('default');
    const form = new FormData();
    form.append('file', file);
    await http.post(`/knowledge/knowledge_revision/${revisionId}/replace-file`, form, {
      params: { expectedVersion },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static async downloadSource(revisionId: number, fallbackName = 'source'): Promise<void> {
    await downloadAuthenticatedFile(
      `/knowledge/knowledge_revision/${revisionId}/source/download`,
      fallbackName,
    );
  }
}
