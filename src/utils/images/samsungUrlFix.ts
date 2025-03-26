
/**
 * Sanitizes Samsung URLs by removing query parameters that might cause issues
 */
export const sanitizeSamsungUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    // Check if it's a Samsung URL
    if (url.includes('samsung.com')) {
      console.log(`Sanitizing Samsung URL: ${url}`);
      
      // Parse the URL
      const parsedUrl = new URL(url);
      
      // Recreate the URL without search params 
      // This is crucial for Samsung images that fail to load with query params
      const sanitizedUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
      
      console.log(`Sanitized Samsung URL: ${sanitizedUrl}`);
      return sanitizedUrl;
    }
  } catch (error) {
    console.error(`Error sanitizing URL: ${url}`, error);
  }
  
  // Return original URL if not a Samsung URL or if there was an error
  return url;
};
