/**
 * 机构名称展示：优先用列表/VO 自带的 organName，缺失时显示 organId。
 */
export type OrganNamed = { organId?: number | null; organName?: string | null };

export function organName(row?: OrganNamed | null): string {
  if (!row) return '-';
  if (row.organName) return row.organName;
  return row.organId == null ? '-' : String(row.organId);
}
