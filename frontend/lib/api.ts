import { use } from "react"
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
    throw new Error(error.error || "Something went wrong")
  }

  return response.json()
}

// Auth APIs
export const authApi = {
  register: (data: any) => api("/v1/auth/register", { method: "POST", body: data }),
  login: (data: any) => api("/v1/auth/login", { method: "POST", body: data }),
  confirm: (data :any) => api(`/v1/auth/confirm`,{ method: "POST", body: data }),
  forgotPassword: (data: any) => api("/v1/auth/forgot-password", { method: "POST", body: data }),
  resetPassword: (data: any, user_id: string, code :string) => api(`/v1/auth/reset-password?user_id=${user_id}&code=${code}`, { method: "POST", body: data }),
  
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
// Responses APIs
export const responsesApi = {
  getAll: (formId: string, token: string) => api(`/v1/responses/${formId}`, { token }),
  getDetails: (formId: string, responseId: string, token: string) =>
    api(`/v1/responses/${formId}/r/${responseId}`, { token }),
  download: async (formId: string, token: string): Promise<Blob> => {
    const response = await fetch(`${config.apiUrl}/v1/responses/download/${formId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/csv' // Important for CSV responses
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to download responses");
    }

    return await response.blob();
  },
}

// Analytics APIs
export const analyticsApi = {
  getResponseSummary: (formId: string, token: string) => api(`/v1/analytics/responses/${formId}/summary`, { token }),
}

export const templatesApi = {
  getAll: (token: string) => api("/v1/templates/list", { token }),
  useTemplate: (templateId: string, token: string) =>
    api(`/v1/templates/${templateId}/use`, { method: "POST", token }),

  previewTemplate: (templateId: string, token: string) =>
    api(`/v1/templates/${templateId}/preview`, { token }),
  }

  