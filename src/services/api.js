const API_URL = 'https://frontend-interview-mock-data.s3.eu-central-1.amazonaws.com/mock-buildings-devices.json'

export const fetchBuildingsData = async () => {
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different response formats
    if (Array.isArray(data)) {
      // If response is directly an array of buildings
      return { buildings: data }
    } else if (data && data.buildings) {
      // If response has buildings property
      return data
    } else if (data && typeof data === 'object') {
      // Try to find buildings in the object
      const buildings = data.buildings || data.data || Object.values(data).find(Array.isArray)
      if (buildings) {
        return { buildings }
      }
    }
    
    return { buildings: [] }
  } catch (error) {
    console.error('Failed to fetch buildings data:', error)
    // Provide more user-friendly error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.')
    }
    if (error.message.includes('HTTP error')) {
      throw new Error(`Server error: ${error.message}. Please try again later.`)
    }
    throw new Error(error.message || 'Failed to load buildings data. Please try again.')
  }
}
