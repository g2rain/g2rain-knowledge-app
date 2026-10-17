/**
 * 知识分类表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识分类表接口
 */
export interface KnowledgeCategory extends BaseVo {
  organId: number;
  categoryCode: string;
  categoryName: string;
  status: string;
  sortOrder: number;
  remark: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeCategoryPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  categoryCode?: string;
  categoryName?: string;
  status?: string;
  sortOrder?: number;
  remark?: string;
}

/**
 * 知识分类表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeCategoryQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  categoryCode?: string;
  categoryName?: string;
  status?: string;
  sortOrder?: number;
  remark?: string;
}

