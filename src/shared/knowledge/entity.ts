/**
 * 后端无 getById，统一通过 list({ id }) 取唯一记录。
 */
export async function getEntityById<T>(
  list: (params: { id: number }) => Promise<T[]>,
  id: number,
  entityLabel = '记录',
): Promise<T> {
  const rows = await list({ id });
  if (!rows.length) {
    throw new Error(`${entityLabel}不存在或无权访问`);
  }
  if (rows.length > 1) {
    throw new Error(`${entityLabel}查询结果异常：期望 1 条，实际 ${rows.length} 条`);
  }
  return rows[0];
}

/** 过滤空查询条件，保留 0 / false */
export function compactQuery<T extends Record<string, unknown>>(query: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(query).filter(([, v]) => (v ?? '') !== '' && [v].flat().length),
  ) as Partial<T>;
}
