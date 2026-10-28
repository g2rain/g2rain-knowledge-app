import { ElMessage } from 'element-plus';
import { getHttpClient } from '@runtime/http';

function parseFilename(contentDisposition?: string): string | undefined {
  if (!contentDisposition) return undefined;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim());
    } catch {
      return utf8[1].trim();
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return plain?.[1]?.trim();
}

/** 读取 JSON 错误体里的 errorMessage，解析失败时返回默认文案 */
async function readErrorMessage(blob: Blob): Promise<string> {
  try {
    const json = JSON.parse(await blob.text()) as { errorMessage?: string };
    return json.errorMessage || '下载失败';
  } catch {
    return '下载失败';
  }
}

/**
 * 受控下载二进制附件，读取服务端文件名并释放 object URL。
 * 请求失败由 http 层统一提示；HTTP 200 但返回错误体时在这里提示。
 */
export async function downloadAuthenticatedFile(
  url: string,
  fallbackName: string,
  params?: object,
): Promise<void> {
  const http = getHttpClient('default');
  const res = await http.request<Blob>({
    url,
    method: 'GET',
    params,
    responseType: 'blob',
  });

  const data = res.data as unknown;
  if (data && typeof data === 'object' && !(data instanceof Blob) && 'errorMessage' in data) {
    ElMessage.error((data as { errorMessage?: string }).errorMessage || '下载失败');
    return;
  }

  const blob = data instanceof Blob ? data : new Blob([data as BlobPart]);
  if (blob.type?.includes('application/json')) {
    ElMessage.error(await readErrorMessage(blob));
    return;
  }

  const headers = (res as { headers?: Record<string, string> }).headers;
  const disposition = headers?.['content-disposition'] || headers?.['Content-Disposition'];
  const filename = parseFilename(disposition) || fallbackName;
  const objectUrl = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.click();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
