/**
 * 机构名称展示：优先用列表/VO 自带的 organName；缺失时再按 organId 批量补查。
 */
import { ref } from 'vue';
import { OrganApi } from '@/views/organ/api';

const organNameMap = ref<Record<number, string>>({});

export type OrganNamed = { organId?: number | null; organName?: string | null };

/** 把已有 organName 写入缓存，并对仍缺名称的 organId 批量补查 */
export async function ensureOrganNames(rows: OrganNamed[]): Promise<void> {
  const next = { ...organNameMap.value };
  let dirty = false;
  for (const row of rows) {
    if (row.organId != null && row.organName && !next[row.organId]) {
      next[row.organId] = row.organName;
      dirty = true;
    }
  }
  if (dirty) {
    organNameMap.value = next;
  }

  const missing = [
    ...new Set(
      rows
        .map((r) => r.organId)
        .filter(
          (id): id is number =>
            typeof id === 'number' && Number.isFinite(id) && id > 0 && !organNameMap.value[id],
        ),
    ),
  ];
  if (!missing.length) return;
  try {
    const mapped = await OrganApi.selectIdNameMap(missing);
    const filled = { ...organNameMap.value };
    for (const item of mapped) {
      if (item.organId != null && item.organName) {
        filled[item.organId] = item.organName;
      }
    }
    organNameMap.value = filled;
  } catch {
    /* 补查失败时回退显示 organId */
  }
}

/** 优先 row.organName，其次缓存，最后回退 organId */
export function organName(row?: OrganNamed | null): string {
  if (!row) return '-';
  if (row.organName) return row.organName;
  const id = row.organId;
  if (id == null) return '-';
  return organNameMap.value[id] || String(id);
}
