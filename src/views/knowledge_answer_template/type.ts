/**
 * 知识回复模板表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识回复模板表接口
 */
export interface KnowledgeAnswerTemplate extends BaseVo {
  organId: number;
  organName?: string;
  templateCode: string;
  templateName: string;
  systemPrompt: string;
  status: string;
  remark: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeAnswerTemplatePayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  templateCode?: string;
  templateName?: string;
  systemPrompt?: string;
  status?: string;
  remark?: string;
}

/**
 * 知识回复模板表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeAnswerTemplateQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  templateCode?: string;
  templateName?: string;
  systemPrompt?: string;
  status?: string;
  remark?: string;
}

