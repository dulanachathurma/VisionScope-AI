import axios from 'axios'

// Base URL for the Flask backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})


/**
 * Upload an image file and get detections back.
 * @param {File} file - The image file
 * @returns {Promise<{detections: Array, annotated_image: string}>}
 */
export async function detectFromFile(file) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await api.post('/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return response.data
}


/**
 * Send a base64 webcam frame and get detections back.
 * @param {string} base64Frame - base64 encoded image string (with data URI prefix)
 * @returns {Promise<{detections: Array, annotated_image: string}>}
 */
export async function detectFromFrame(base64Frame) {
  const response = await api.post('/detect-frame', {
    frame: base64Frame
  })

  return response.data
}


/**
 * Check if the backend is running.
 * @returns {Promise<boolean>}
 */
export async function checkHealth() {
  try {
    const response = await api.get('/health')
    return response.data.status === 'ok'
  } catch {
    return false
  }
}
