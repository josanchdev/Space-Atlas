import { apiClient } from './api/client'

export const poisService = {
  /**
   * Obtiene todos los POIs
   * @returns {Promise<Array>}
   */
  async getAll() {
    return apiClient.get('/pois')
  },

  /**
   * Obtiene un POI por ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return apiClient.get(`/pois/${id}`)
  },

  /**
   * Obtiene POIs filtrados por path (planeta/cuerpo celeste)
   * @param {string} pathName
   * @returns {Promise<Array>}
   */
  async getByPath(pathName) {
    const allPois = await this.getAll()
    return allPois.filter(poi => 
      poi.path?.toLowerCase() === pathName?.toLowerCase()
    )
  },

  /**
   * Crea un nuevo POI
   * @param {Object} poiData - { title, description,lat, lon, path}
   * @returns {Promise<Object>}
   */
  async create(poiData) {
    return apiClient.post('/pois', poiData)
  },

  /**
   * Actualiza un POI existente
   * @param {string} id
   * @param {Object} poiData
   * @returns {Promise<Object>}
   */
  async update(id, poiData) {
    return apiClient.put(`/pois/${id}`, poiData)
  },

  /**
   * Elimina un POI
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async delete(id) {
    return apiClient.delete(`/pois/${id}`)
  },

  /**
   * Explica un POI usando IA
   * @param {Object} params - { title, description, path }
   * @returns {Promise<Object>}
   */
  async explain(params) {
    return apiClient.post('/explain', params)
  },

  /**
   * Chat con un POI
   * @param {Object} chatData - { poiTitle, poiDescription, userMessage, conversationHistory, imageUrl }
   * @returns {Promise<Object>}
   */
  async chat(chatData) {
    return apiClient.post('/poi/chat', chatData)
  }
}