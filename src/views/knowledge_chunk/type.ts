/**
 * 知识切片清单表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识切片清单表接口
 */
export interface KnowledgeChunk extends BaseVo {
  organId: number;
  revisionId: number;
  chunkNo: number;
  parentChunkNo: number;
  sourceLocator: string;
  titlePath: string;
  pageStart: number;
  pageEnd: number;
  tokenCount: number;
  contentSha256: string;
  chunkStatus: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeChunkPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  revisionId?: number;
  chunkNo?: number;
  parentChunkNo?: number;
  sourceLocator?: string;
  titlePath?: string;
  pageStart?: number;
  pageEnd?: number;
  tokenCount?: number;
  contentSha256?: string;
  chunkStatus?: string;
}

/**
 * 知识切片清单表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeChunkQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  revisionId?: number;
  chunkNo?: number;
  parentChunkNo?: number;
  sourceLocator?: string;
  titlePath?: string;
  pageStart?: number;
  pageEnd?: number;
  tokenCount?: number;
  contentSha256?: string;
  chunkStatus?: string;
}

