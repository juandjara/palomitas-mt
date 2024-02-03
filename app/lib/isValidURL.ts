export default function isValidUrl(url?: string) {
  try { 
    const result = new URL(url || '') instanceof URL
    return result
  } catch (e) { 
    return false
  }
}