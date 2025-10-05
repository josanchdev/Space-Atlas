const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiClient {
  constructor(baseURL = API_BASE) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: response.statusText 
        }))
        throw new Error(error.message || `HTTP Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message)
      throw error
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  // Método especial para FormData (archivos)
  async uploadFormData(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      method: 'POST',
      body: formData,
      // No establecer Content-Type para FormData, el browser lo hace automáticamente
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: response.statusText 
        }))
        throw new Error(error.message || `HTTP Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Upload Error [${endpoint}]:`, error.message)
      throw error
    }
  }
}

export const apiClient = new ApiClient()