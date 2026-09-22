const apiUrl = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(public readonly status: number, message = 'No se pudo completar la solicitud.') {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Shared transport for the pc-store API. Feature services will define the
 * concrete endpoint paths after the backend contract is available locally.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiUrl) {
    throw new ApiError(0, 'La aplicación no está configurada para conectarse al servidor.')
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, '')}${path}`, {
    ...init,
    credentials: 'include',
    headers: { Accept: 'application/json', ...init.headers },
  })

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
