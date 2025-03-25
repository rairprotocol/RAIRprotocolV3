/**
 * Image debug utility
 * This file provides utilities to debug image loading issues
 */

/**
 * Logs image loading errors to help diagnose problems
 */
export function setupImageErrorLogging(): void {
  if (typeof window === 'undefined') return;
  
  // Only run in production on Netlify
  if (!window.location.hostname.includes('netlify')) return;
  
  window.addEventListener('load', () => {
    // Find all images on the page
    const images = document.querySelectorAll('img');
    
    // Log any that failed to load
    let failedCount = 0;
    images.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        failedCount++;
        console.error('Image failed to load:', {
          src: img.src,
          alt: img.alt,
          crossOrigin: img.crossOrigin,
          referrerPolicy: img.referrerPolicy
        });
      }
    });
    
    if (failedCount > 0) {
      console.warn(`${failedCount} images failed to load on this page.`);
    } else {
      console.log('All images loaded successfully!');
    }
  });
}

/**
 * Attaches to all images to detect loading issues
 */
export function monitorImages(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('DOMContentLoaded', () => {
    // Observe the document for dynamically added images
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'IMG') {
            const img = node as HTMLImageElement;
            
            img.onerror = () => {
              console.error('Image error:', img.src);
              
              // Try to recover by converting to HTTPS if it's HTTP
              if (img.src.startsWith('http:')) {
                const newSrc = img.src.replace('http:', 'https:');
                console.log(`Attempting to recover by changing to ${newSrc}`);
                img.src = newSrc;
              }
            };
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Define the type for image status details
interface ImageStatusDetail {
  src: string;
  status: string;
  crossOrigin: string | null;
  referrerPolicy: string;
}

// Export an initialization function
export function initImageDebugging(): void {
  if (typeof window === 'undefined') return;
  
  setupImageErrorLogging();
  monitorImages();
  
  // Add to window for debugging
  (window as any).__debugImages = {
    checkImages: () => {
      const images = document.querySelectorAll('img');
      const results = {
        total: images.length,
        loaded: 0,
        failed: 0,
        details: [] as ImageStatusDetail[]
      };
      
      images.forEach(img => {
        const status = img.complete && img.naturalHeight > 0 ? 'loaded' : 'failed';
        if (status === 'loaded') {
          results.loaded++;
        } else {
          results.failed++;
        }
        
        results.details.push({
          src: img.src,
          status,
          crossOrigin: img.crossOrigin,
          referrerPolicy: img.referrerPolicy
        });
      });
      
      console.table(results);
      console.log('Detailed results:', results.details);
      return results;
    }
  };
} 