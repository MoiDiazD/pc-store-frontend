const apiUrl = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(public readonly status: number, message = 'No se pudo completar la solicitud.') {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}${path}`, {
    ...init,
    credentials: 'include',
    headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  })
  if (!response.ok) {
    let message: string | undefined
    try {
      const body = await response.json() as { message?: string | string[] }
      message = Array.isArray(body.message) ? body.message[0] : body.message
    } catch { /* A response body is not required for errors. */ }
    throw new ApiError(response.status, message || 'No se pudo completar la solicitud.')
  }
  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('content-type') ?? ''
  return (contentType.includes('application/json') ? response.json() : undefined) as Promise<T>
}

export function userMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'No se ha podido conectar con el servidor. Inténtalo de nuevo.'
  if (error.status === 401) return 'Tu sesión no es válida. Accede de nuevo para continuar.'
  if (error.status === 403) return 'No tienes permiso para realizar esta acción.'
  if (error.status === 404) return 'No hemos encontrado el recurso solicitado.'
  if (error.status === 409) return 'Esta acción no se puede completar en el estado actual.'
  if (error.status >= 500) return 'El servidor ha tenido un problema. Inténtalo más tarde.'
  return error.message
}
