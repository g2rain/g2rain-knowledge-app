/**
 * 知识标签字典表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识标签字典表接口
 */
export interface KnowledgeTag extends BaseVo {
  organId: number;
  organName?: string;
  tagCode: string;
  tagName: string;
  status: string;
  sortOrder: number;
  remark: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeTagPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  tagCode?: string;
  tagName?: string;
  status?: string;
  sortOrder?: number;
  remark?: string;
}

/**
 * 知识标签字典表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeTagQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  tagCode?: string;
  tagName?: string;
  status?: string;
  sortOrder?: number;
  remark?: string;
}

