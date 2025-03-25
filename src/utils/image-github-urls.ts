/**
 * Utility to convert local image paths to GitHub raw URLs
 * This helps fix image references on Netlify deployments
 */

/**
 * Convert a local asset path to a GitHub raw URL
 * @param path Local asset path starting with ~ or src/
 * @returns GitHub raw URL for the same asset
 */
export function toGitHubRawUrl(path: string): string {
  // Handle paths starting with ~/ or src/
  if (path.startsWith('~/')) {
    return `https://raw.githubusercontent.com/RAIReth/RAIRprotocolV2/main/src/${path.substring(2)}`;
  } else if (path.startsWith('src/')) {
    return `https://raw.githubusercontent.com/RAIReth/RAIRprotocolV2/main/${path}`;
  }
  
  // If it's already an absolute URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Assume it's a relative path from src/
  return `https://raw.githubusercontent.com/RAIReth/RAIRprotocolV2/main/src/${path}`;
}

/**
 * Check if we're running on Netlify
 * @returns boolean indicating if the app is running on Netlify
 */
export function isNetlify(): boolean {
  return (
    // Either we're on Netlify
    (typeof window !== 'undefined' && 
     import.meta.env.PROD && 
     window.location.hostname.includes('netlify')) ||
    // Or the GITHUB_IMAGES env var is set
    import.meta.env.GITHUB_IMAGES === 'true'
  );
}

/**
 * Get the appropriate image URL based on environment
 * @param path Local asset path
 * @returns Either GitHub raw URL (on Netlify) or local path (development)
 */
export function getImageUrl(path: string): string {
  if (!isNetlify()) {
    return path;
  }
  
  // For Netlify, force HTTPS and use githubusercontent
  return toGitHubRawUrl(path);
} 