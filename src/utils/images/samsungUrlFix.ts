
/**
 * This utility has been modified to completely avoid Samsung URLs
 * rather than trying to sanitize them
 */
export const sanitizeSamsungUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    // Check if it's a Samsung URL
    if (url.includes('samsung.com')) {
      console.log(`Avoiding Samsung URL: ${url}`);
      
      // Return a default Cloudinary placeholder instead of trying to fix Samsung URLs
      return 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
    }
  } catch (error) {
    console.error(`Error processing URL: ${url}`, error);
  }
  
  // Return original URL if not a Samsung URL or if there was an error
  return url;
};
