/**
 * 检索 / 问答 API
 */

import { getHttpClient } from '@runtime/http';
import type {
  KnowledgeAnswerResult,
  KnowledgeAnswerPayload,
  KnowledgeRetrieveResult,
  KnowledgeRetrievePayload,
} from './type';

export class KnowledgeSearchApi {
  static async retrieve(payload: KnowledgeRetrievePayload): Promise<KnowledgeRetrieveResult> {
    const http = getHttpClient('default');
    const res = await http.post<KnowledgeRetrieveResult>('/knowledge/retrieve', payload);
    return res.data;
  }

  static async answer(payload: KnowledgeAnswerPayload): Promise<KnowledgeAnswerResult> {
    const http = getHttpClient('default');
    const res = await http.post<KnowledgeAnswerResult>('/knowledge/answer', payload);
    return res.data;
  }
}
