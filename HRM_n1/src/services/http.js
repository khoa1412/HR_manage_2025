// Lightweight HTTP client for FE → BE integration
export function getBaseURL() {
  // Default base to BE port 8300 with global prefix /api
  return (import.meta?.env?.VITE_API_BASE_URL) || 'http://localhost:8300/api'
}

export async function request(path, init) {
  const baseURL = getBaseURL()
  const res = await fetch(`${baseURL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init && init.headers ? init.headers : {}),
    },
  })
  if (!res.ok) {
    let body = {}
    try { body = await res.json() } catch {}
    const err = {
      status: res.status,
      code: body?.code || body?.error || body?.constraint,
      message: body?.message || res.statusText,
      details: body,
    }
    if (res.status === 409 && typeof body?.constraint === 'string' && body.constraint.startsWith('ex_')) {
      err.code = 'OVERLAP'
    }
    throw err
  }
  try { return await res.json() } catch { return undefined }
}

export const http = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: (url, data) => request(url, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  del: (url) => request(url, { method: 'DELETE' }),
}


