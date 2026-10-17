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

/**
 * 受控下载二进制附件，读取服务端文件名并释放 object URL。
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
    const err = data as { errorMessage?: string };
    throw new Error(err.errorMessage || '下载失败');
  }

  const blob = data instanceof Blob ? data : new Blob([data as BlobPart]);
  if (blob.type?.includes('application/json')) {
    const text = await blob.text();
    try {
      const json = JSON.parse(text) as { errorMessage?: string };
      throw new Error(json.errorMessage || '下载失败');
    } catch (e) {
      if (e instanceof Error && e.message !== '下载失败' && !e.message.includes('JSON')) {
        throw e;
      }
      throw new Error('下载失败');
    }
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
