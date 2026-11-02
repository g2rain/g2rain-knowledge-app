/**
 * 知识主题 API
 */

import { getHttpClient } from '@runtime/http';
import { getEntityById } from '@shared/knowledge/entity';
import type {
  KnowledgeImportOptions,
  KnowledgeImportResult,
  KnowledgeItem,
  KnowledgeItemPayload,
  KnowledgeItemQuery,
} from './type';
import type { PageData, PageSelectListDto } from '@platform/types/api.type';

import './mock';

function appendImportOptions(form: FormData, options?: KnowledgeImportOptions) {
  if (!options) return;
  if (options.categoryId != null) {
    form.append('categoryId', String(options.categoryId));
  }
  if (options.submitReview != null) {
    form.append('submitReview', String(options.submitReview));
  }
  if (options.priority != null) {
    form.append('priority', String(options.priority));
  }
  (options.tags || []).forEach((tag) => form.append('tags', tag));
}

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

  /** RQ-008 专用共享范围命令 */
  static async setVisibility(knowledgeId: number, visibility: string, expectedVersion: number): Promise<void> {
    const http = getHttpClient('default');
    await http.post('/knowledge/knowledge_item/visibility', {
      knowledgeId,
      visibility,
      expectedVersion,
    });
  }

  static async importItems(file: File, options?: KnowledgeImportOptions): Promise<KnowledgeImportResult> {
    const http = getHttpClient('default');
    const form = new FormData();
    form.append('file', file);
    appendImportOptions(form, options);
    const res = await http.post<KnowledgeImportResult>('/knowledge/knowledge_item/import/items', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async importFaq(file: File, options?: KnowledgeImportOptions): Promise<KnowledgeImportResult> {
    const http = getHttpClient('default');
    const form = new FormData();
    form.append('file', file);
    appendImportOptions(form, options);
    const res = await http.post<KnowledgeImportResult>('/knowledge/knowledge_item/import/faq', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async importFiles(files: File[], options?: KnowledgeImportOptions): Promise<KnowledgeImportResult> {
    const http = getHttpClient('default');
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    appendImportOptions(form, options);
    const res = await http.post<KnowledgeImportResult>('/knowledge/knowledge_item/import/files', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
}
