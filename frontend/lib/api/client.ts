const DEFAULT_API_BASE_URL = 'http://localhost:8080';

const sanitizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

const apiBaseUrl = sanitizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
);

export const getApiBaseUrl = () => apiBaseUrl;

interface ApiFetchOptions extends RequestInit {
  skipJsonParse?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { skipJsonParse, headers, ...rest } = options;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${apiBaseUrl}${normalizedPath}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed (${response.status}): ${errorText || response.statusText}`
    );
  }

  if (skipJsonParse || response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
