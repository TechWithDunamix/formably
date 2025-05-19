import { config } from "./config"

interface ApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
  token?: string
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, token } = options

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }

  return response.json()
}

// Auth APIs
export const authApi = {
  register: (data: any) => api("/v1/auth/register", { method: "POST", body: data }),
  login: (data: any) => api("/v1/auth/login", { method: "POST", body: data }),
}

// Forms APIs
export const formsApi = {
  create: (data: any, token: string) => api("/v1/forms/create", { method: "POST", body: data, token }),
  getAll: (token: string, limit?: number, offset?: number) => {
    const query = new URLSearchParams()
    if (limit) query.append("limit", limit.toString())
    if (offset) query.append("offset", offset.toString())
    return api(`/v1/forms/all?${query.toString()}`, { token })
  },
  getDetails: (formId: string, token: string) => api(`/v1/forms/${formId}/details`, { token }),
  update: (formId: string, data: any, token: string) =>
    api(`/v1/forms/${formId}/update`, { method: "PUT", body: data, token }),
  delete: (formId: string, token: string) => api(`/v1/forms/${formId}/delete`, { method: "DELETE", token }),
}

// Public APIs
export const publicApi = {
  getFormDetails: (formId: string) => api(`/v1/public/${formId}/details`),
  submitResponse: (formId: string, data: any) => api(`/v1/public/${formId}/submit`, { method: "POST", body: data }),
}

// Responses APIs
export const responsesApi = {
  getAll: (formId: string, token: string) => api(`/v1/responses/${formId}`, { token }),
  getDetails: (formId: string, responseId: string, token: string) =>
    api(`/v1/responses/${formId}/r/${responseId}`, { token }),
  download: (formId: string, token: string) => api(`/v1/responses/download/${formId}`, { token }),
}

// Analytics APIs
export const analyticsApi = {
  getResponseSummary: (formId: string, token: string) => api(`/v1/analytics/responses/${formId}/summary`, { token }),
}
