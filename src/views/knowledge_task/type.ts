/**
 * 知识解析与索引处理任务表相关类型定义
 */

import type { BaseSelectListDto, BaseVo } from '@platform/types/api.type';

/**
 * 知识解析与索引处理任务表接口
 */
export interface KnowledgeTask extends BaseVo {
  organId: number;
  revisionId: number;
  taskType: string;
  taskStatus: string;
  idempotencyKey: string;
  inputSnapshot: string;
  attemptNo: number;
  availableTime: string;
  leaseOwner: string;
  leaseExpireTime: string;
  leaseGeneration: number;
  cancelRequested: number;
  providerName: string;
  modelName: string;
  traceId: string;
  startedTime: string;
  finishedTime: string;
  errorCode: string;
  errorSummary: string;
}

/**
 * 用于创建 / 更新时提交的负载（不包含审计字段）
 */
export interface KnowledgeTaskPayload {
  id?: number; // 更新时传入 ID，新增时不传
  organId?: number;
  revisionId?: number;
  taskType?: string;
  taskStatus?: string;
  idempotencyKey?: string;
  inputSnapshot?: string;
  attemptNo?: number;
  availableTime?: string;
  leaseOwner?: string;
  leaseExpireTime?: string;
  leaseGeneration?: number;
  cancelRequested?: number;
  providerName?: string;
  modelName?: string;
  traceId?: string;
  startedTime?: string;
  finishedTime?: string;
  errorCode?: string;
  errorSummary?: string;
}

/**
 * 知识解析与索引处理任务表查询条件
 * 用于分页查询时的业务查询参数
 * 包含业务查询字段和基础查询字段（BaseSelectListDto）
 */
export interface KnowledgeTaskQuery extends BaseSelectListDto {
  // 业务查询字段
  organId?: number;
  revisionId?: number;
  taskType?: string;
  taskStatus?: string;
  idempotencyKey?: string;
  inputSnapshot?: string;
  attemptNo?: number;
  availableTime?: string;
  leaseOwner?: string;
  leaseExpireTime?: string;
  leaseGeneration?: number;
  cancelRequested?: number;
  providerName?: string;
  modelName?: string;
  traceId?: string;
  startedTime?: string;
  finishedTime?: string;
  errorCode?: string;
  errorSummary?: string;
}

