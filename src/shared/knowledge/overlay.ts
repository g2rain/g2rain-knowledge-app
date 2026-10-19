/** 统一弹层尺寸约定（方案 4.2） */
export const OVERLAY_SIZE = {
  /** 主题新建/编辑、审核/任务详情 */
  drawer: '480px',
  /** 版本管理大尺寸抽屉 */
  largeDrawer: '72%',
  /** 版本新建/编辑弹窗 */
  editDialog: '640px',
  /** 发布/回滚确认等 */
  confirmDialog: '480px',
} as const;

export const POLL_INTERVAL_MS = 8000;
