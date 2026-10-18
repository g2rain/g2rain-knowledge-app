/**
 * 知识发布选择表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识发布选择表接口
 */
export interface KnowledgeRelease extends BaseVo {
  organId: number;
  knowledgeId: number;
  activeRevisionId: number;
  releaseStatus: string;
  publishedUserId: number;
  publishedTime: string;
  releaseReason: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeReleasePayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  knowledgeId?: number;
  activeRevisionId?: number;
  releaseStatus?: string;
  publishedUserId?: number;
  publishedTime?: string;
  releaseReason?: string;
}

/**
 * 知识发布选择表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeReleaseQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  knowledgeId?: number;
  activeRevisionId?: number;
  releaseStatus?: string;
  publishedUserId?: number;
  publishedTime?: string;
  releaseReason?: string;
}

export interface KnowledgeReleasePublishPayload {
  releaseId: number;
  revisionId: number;
  reason?: string;
}

