/** 版本状态 → 用户可见文案与下一站（方案 4.2） */
export interface RevisionStatusInfo {
  label: string;
  nextStep: string;
  menuHint: string;
}

export const REVISION_STATUS_MAP: Record<string, RevisionStatusInfo> = {
  DRAFT: {
    label: '草稿',
    nextStep: '完善内容后提交审核',
    menuHint: '知识内容',
  },
  REVIEWING: {
    label: '待审核',
    nextStep: '等待审核人员处理',
    menuHint: '内容审核',
  },
  APPROVED: {
    label: '待处理',
    nextStep: '审核已通过，等待开始处理',
    menuHint: '知识处理 → 待处理',
  },
  PROCESSING: {
    label: '处理中',
    nextStep: '跟进进度',
    menuHint: '知识处理 → 处理中',
  },
  PROCESS_FAILED: {
    label: '处理失败',
    nextStep: '查看原因并重试关联任务',
    menuHint: '知识处理 → 处理失败',
  },
  READY_TO_PUBLISH: {
    label: '待发布',
    nextStep: '确认后发布',
    menuHint: '发布管理 → 待发布',
  },
  PUBLISHED: {
    label: '已发布',
    nextStep: '查看线上内容和验证效果',
    menuHint: '发布管理、效果验证',
  },
  DEPRECATED: {
    label: '历史版本',
    nextStep: '需要时回滚',
    menuHint: '发布管理',
  },
  PARSING: {
    label: '处理中',
    nextStep: '跟进解析进度',
    menuHint: '知识处理 → 处理中',
  },
  PARSE_FAILED: {
    label: '处理失败',
    nextStep: '查看解析失败原因',
    menuHint: '知识处理 → 处理失败',
  },
  INDEXING: {
    label: '处理中',
    nextStep: '跟进索引进度',
    menuHint: '知识处理 → 处理中',
  },
  INDEX_FAILED: {
    label: '处理失败',
    nextStep: '查看索引失败原因',
    menuHint: '知识处理 → 处理失败',
  },
  REJECTED: {
    label: '草稿',
    nextStep: '审核已驳回，请修改后重新提交',
    menuHint: '知识内容',
  },
};

export function getRevisionStatusInfo(status?: string): RevisionStatusInfo {
  if (!status) {
    return { label: '-', nextStep: '', menuHint: '' };
  }
  return (
    REVISION_STATUS_MAP[status] || {
      label: status,
      nextStep: '',
      menuHint: '',
    }
  );
}

export function formatRevisionStatus(status?: string): string {
  const info = getRevisionStatusInfo(status);
  return info.label === status || !status ? status || '-' : `${info.label}（${status}）`;
}

export function formatNextStepHint(status?: string): string {
  const info = getRevisionStatusInfo(status);
  if (!info.nextStep) return '';
  return `${info.nextStep}；下一站：${info.menuHint}`;
}

/** 用户可见的业务状态选项（编辑/筛选） */
export const ITEM_STATUS_OPTIONS = [
  { label: '启用', value: 'ACTIVE' },
  { label: '停用', value: 'INACTIVE' },
];

/** 知识主题类型（knowledge_item.knowledgeType） */
export const KNOWLEDGE_TYPE_OPTIONS = [
  { label: '文档', value: 'DOCUMENT' },
  { label: 'FAQ', value: 'FAQ' },
];

/** 版本来源类型（knowledge_revision.sourceType） */
export const SOURCE_TYPE_OPTIONS = [
  { label: '文档', value: 'FILE' },
  { label: 'FAQ', value: 'FAQ' },
];

/**
 * 展示标签：主题用 DOCUMENT/FAQ，来源用 FILE/FAQ；
 * 兼容历史误写入的 knowledgeType=FILE。
 */
export function resolveTypeLabel(type?: string): string {
  if (!type) return '-';
  if (type === 'FILE') return '文档';
  return (
    KNOWLEDGE_TYPE_OPTIONS.find((o) => o.value === type)?.label ||
    SOURCE_TYPE_OPTIONS.find((o) => o.value === type)?.label ||
    type
  );
}
