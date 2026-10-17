/**
 * 知识主题表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识主题表接口
 */
export interface KnowledgeItem extends BaseVo {
  organId: number;
  categoryId: number;
  knowledgeKey: string;
  knowledgeName: string;
  knowledgeType: string;
  status: string;
  description: string;
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

