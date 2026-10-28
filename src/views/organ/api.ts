/**
 * 机构 API（供 OrganSelect / ApiSelect 复用）
 */
import { getHttpClient } from '@runtime/http';
import type { OrganIdNameMap } from './type';

export class OrganApi {
  /**
   * 机构搜索（用于 RemoteSelect）
   * - value：按机构标识匹配，同时匹配名称包含该数字的机构
   * - key：按名称关键字匹配
   */
  static async searchOrgans(params: { key?: string; value?: number; signal?: AbortSignal } = {}): Promise<OrganIdNameMap[]> {
    const http = getHttpClient('default');
    const res = await http.get<OrganIdNameMap[]>('/basis/organ/search', { id: params.value, organName: params.key }, { signal: params.signal });
    return res.data || [];
  }

  /** 按机构 ID 批量解析名称（表格展示用） */
  static async selectIdNameMap(ids: number[]): Promise<OrganIdNameMap[]> {
    if (!ids.length) return [];
    const http = getHttpClient('default');
    const res = await http.post<OrganIdNameMap[]>('/basis/organ/id_name_map', { ids });
    return res.data || [];
  }
}
