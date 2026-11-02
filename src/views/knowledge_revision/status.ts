import { t } from '@platform/i18n';

/** 版本状态 → 用户可见文案与下一站（方案 4.2）；展示文案经 i18n，不是字典项 */
export interface RevisionStatusInfo {
  label: string;
  nextStep: string;
  menuHint: string;
}

interface RevisionStatusDef {
  labelCode: string;
  labelFb: string;
  nextCode: string;
  nextFb: string;
  menuCode: string;
  menuFb: string;
}

const REVISION_STATUS_DEFS: Record<string, RevisionStatusDef> = {
  DRAFT: {
    labelCode: 'KN_REV_LABEL_DRAFT',
    labelFb: '草稿',
    nextCode: 'KN_REV_NEXT_DRAFT',
    nextFb: '完善内容后提交审核',
    menuCode: 'KN_REV_MENU_DRAFT',
    menuFb: '知识内容',
  },
  REVIEWING: {
    labelCode: 'KN_REV_LABEL_REVIEWING',
    labelFb: '待审核',
    nextCode: 'KN_REV_NEXT_REVIEWING',
    nextFb: '等待审核人员处理',
    menuCode: 'KN_REV_MENU_REVIEWING',
    menuFb: '内容审核',
  },
  APPROVED: {
    labelCode: 'KN_REV_LABEL_APPROVED',
    labelFb: '待处理',
    nextCode: 'KN_REV_NEXT_APPROVED',
    nextFb: '审核已通过，等待开始处理',
    menuCode: 'KN_REV_MENU_APPROVED',
    menuFb: '知识处理（队列=待处理）',
  },
  PROCESSING: {
    labelCode: 'KN_REV_LABEL_PROCESSING',
    labelFb: '处理中',
    nextCode: 'KN_REV_NEXT_PROCESSING',
    nextFb: '跟进进度',
    menuCode: 'KN_REV_MENU_PROCESSING',
    menuFb: '知识处理（队列=待执行 / 运行中）',
  },
  PROCESS_FAILED: {
    labelCode: 'KN_REV_LABEL_FAILED',
    labelFb: '处理失败',
    nextCode: 'KN_REV_NEXT_PROCESS_FAILED',
    nextFb: '查看原因并重试关联任务',
    menuCode: 'KN_REV_MENU_FAILED',
    menuFb: '知识处理（队列=处理失败）',
  },
  READY_TO_PUBLISH: {
    labelCode: 'KN_REV_LABEL_READY',
    labelFb: '待发布',
    nextCode: 'KN_REV_NEXT_READY',
    nextFb: '确认后发布',
    menuCode: 'KN_REV_MENU_READY',
    menuFb: '发布管理（视图=待发布）',
  },
  PUBLISHED: {
    labelCode: 'KN_REV_LABEL_PUBLISHED',
    labelFb: '已发布',
    nextCode: 'KN_REV_NEXT_PUBLISHED',
    nextFb: '查看线上内容和验证效果',
    menuCode: 'KN_REV_MENU_PUBLISHED',
    menuFb: '发布管理、效果验证',
  },
  DEPRECATED: {
    labelCode: 'KN_REV_LABEL_DEPRECATED',
    labelFb: '历史版本',
    nextCode: 'KN_REV_NEXT_DEPRECATED',
    nextFb: '需要时回滚',
    menuCode: 'KN_REV_MENU_DEPRECATED',
    menuFb: '发布管理',
  },
  PARSING: {
    labelCode: 'KN_REV_LABEL_PROCESSING',
    labelFb: '处理中',
    nextCode: 'KN_REV_NEXT_PARSING',
    nextFb: '跟进解析进度',
    menuCode: 'KN_REV_MENU_PROCESSING',
    menuFb: '知识处理（队列=待执行 / 运行中）',
  },
  PARSE_FAILED: {
    labelCode: 'KN_REV_LABEL_FAILED',
    labelFb: '处理失败',
    nextCode: 'KN_REV_NEXT_PARSE_FAILED',
    nextFb: '查看解析失败原因',
    menuCode: 'KN_REV_MENU_FAILED',
    menuFb: '知识处理（队列=处理失败）',
  },
  INDEXING: {
    labelCode: 'KN_REV_LABEL_PROCESSING',
    labelFb: '处理中',
    nextCode: 'KN_REV_NEXT_INDEXING',
    nextFb: '跟进索引进度',
    menuCode: 'KN_REV_MENU_PROCESSING',
    menuFb: '知识处理（队列=待执行 / 运行中）',
  },
  INDEX_FAILED: {
    labelCode: 'KN_REV_LABEL_FAILED',
    labelFb: '处理失败',
    nextCode: 'KN_REV_NEXT_INDEX_FAILED',
    nextFb: '查看索引失败原因',
    menuCode: 'KN_REV_MENU_FAILED',
    menuFb: '知识处理（队列=处理失败）',
  },
  REJECTED: {
    labelCode: 'KN_REV_LABEL_DRAFT',
    labelFb: '草稿',
    nextCode: 'KN_REV_NEXT_REJECTED',
    nextFb: '审核已驳回，请修改后重新提交',
    menuCode: 'KN_REV_MENU_DRAFT',
    menuFb: '知识内容',
  },
};

export function getRevisionStatusInfo(status?: string): RevisionStatusInfo {
  if (!status) {
    return { label: '-', nextStep: '', menuHint: '' };
  }
  const def = REVISION_STATUS_DEFS[status];
  if (!def) {
    return { label: status, nextStep: '', menuHint: '' };
  }
  return {
    label: t(def.labelCode, def.labelFb),
    nextStep: t(def.nextCode, def.nextFb),
    menuHint: t(def.menuCode, def.menuFb),
  };
}

export function formatRevisionStatus(status?: string): string {
  const info = getRevisionStatusInfo(status);
  return info.label === status || !status ? status || '-' : `${info.label}（${status}）`;
}

export function formatNextStepHint(status?: string): string {
  const info = getRevisionStatusInfo(status);
  if (!info.nextStep) return '';
  return t(
    'KN_REV_NEXT_HINT',
    { next: info.nextStep, menu: info.menuHint },
    '{next}；下一站：{menu}',
  );
}

/**
 * 展示标签：主题用 DOCUMENT/FAQ，来源用 FILE/FAQ；
 * 兼容历史误写入的 knowledgeType=FILE。
 */
export function resolveTypeLabel(type?: string): string {
  if (!type) return '-';
  if (type === 'FILE' || type === 'DOCUMENT') return t('KN_TYPE_DOCUMENT', '文档');
  if (type === 'FAQ') return t('KN_TYPE_FAQ', 'FAQ');
  return type;
}
