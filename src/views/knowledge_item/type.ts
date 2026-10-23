/**
 * 知识主题表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识主题表接口
 */
export interface KnowledgeItem extends BaseVo {
  organId: number;
  /** 列表接口可能附带；优先用于表格展示 */
  organName?: string;
  categoryId: number;
  knowledgeKey: string;
  knowledgeName: string;
  knowledgeType: string;
  status: string;
  description: string;
  priority: number;
  tagsJson: string;
  createUserId: number;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeItemPayload {
  id?: number; // 更新时传入 ID，新增时不传
  version?: number;
  categoryId?: number;
  knowledgeKey?: string;
  knowledgeName?: string;
  knowledgeType?: string;
  status?: string;
  description?: string;
  priority?: number;
  tagsJson?: string;
}

/**
 * 知识主题表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeItemQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  categoryId?: number;
  knowledgeKey?: string;
  knowledgeName?: string;
  knowledgeType?: string;
  status?: string;
  description?: string;
  createUserId?: number;
}

/** 批量导入选项 */
export interface KnowledgeImportOptions {
  categoryId?: number;
  tags?: string[];
  priority?: number;
  submitReview?: boolean;
}

/** 批量导入单条结果 */
export interface KnowledgeImportItem {
  knowledgeKey?: string;
  itemStatus: 'SUCCESS' | 'SKIPPED' | 'FAILED' | string;
  knowledgeId?: number;
  revisionId?: number;
  errorCode?: string;
  errorMessage?: string;
}

/** 批量导入汇总结果 */
export interface KnowledgeImportResult {
  successCount: number;
  skippedCount: number;
  failedCount: number;
  items: KnowledgeImportItem[];
}

