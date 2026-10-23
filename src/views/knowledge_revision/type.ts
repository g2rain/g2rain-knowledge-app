/**
 * 知识版本表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识版本表接口
 */
export interface KnowledgeRevision extends BaseVo {
  organId: number;
  organName?: string;
  knowledgeId: number;
  revisionNo: string;
  sourceType: string;
  revisionStatus: string;
  sourceFileName: string;
  sourceContentType: string;
  sourceStoragePath: string;
  sourceSha256: string;
  sourceFileSize: number;
  faqQuestion: string;
  faqAnswer: string;
  parserName: string;
  parserVersion: string;
  parserTaskId: string;
  parsedStoragePath: string;
  chunkCount: number;
  indexStatus: string;
  embeddingProfile: string;
  embeddingModel: string;
  indexCompletedTime: string;
  reviewerUserId: number;
  reviewTime: string;
  reviewComment: string;
  createUserId: number;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeRevisionPayload {
  id?: number; // 更新时传入 ID，新增时不传
  /** 更新草稿时的乐观锁期望版本 */
  version?: number;
  knowledgeId?: number;
  revisionNo?: string;
  sourceType?: string;
  faqQuestion?: string;
  faqAnswer?: string;
}

export interface KnowledgeReviewPayload {
  revisionId: number;
  expectedVersion: number;
  comment?: string;
}

/**
 * 知识版本表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeRevisionQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  knowledgeId?: number;
  revisionNo?: string;
  sourceType?: string;
  revisionStatus?: string;
  sourceFileName?: string;
  sourceContentType?: string;
  sourceStoragePath?: string;
  sourceSha256?: string;
  sourceFileSize?: number;
  faqQuestion?: string;
  faqAnswer?: string;
  parserName?: string;
  parserVersion?: string;
  parserTaskId?: string;
  parsedStoragePath?: string;
  chunkCount?: number;
  indexStatus?: string;
  embeddingProfile?: string;
  embeddingModel?: string;
  indexCompletedTime?: string;
  reviewerUserId?: number;
  reviewTime?: string;
  reviewComment?: string;
  createUserId?: number;
}

