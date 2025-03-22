import randomWords from 'random-words';

/**
 * Generates a relevant placeholder image URL based on the product name.
 */
export const getRelevantPlaceholder = (productName: string): string => {
  const keywords = productName.split(' ');
  const placeholderKeywords = keywords.length > 1 ? keywords.slice(0, 2) : keywords;
  const placeholderText = placeholderKeywords.join(' ');
  
  // Generate a unique ID for the placeholder image
  const placeholderId = randomWords({ exactly: 3, maxLength: 5 }).join('-');
  
  // Construct the URL with the generated ID
  return `https://via.placeholder.com/400x300.png?text=${placeholderText}+${placeholderId}`;
};

/**
 * Generates additional relevant images for thumbnails based on product type.
 */
export const generateAdditionalImages = (productName: string, mainImageUrl: string): string[] => {
  const additionalImageCount = 3;
  const additionalImages: string[] = [];
  
  for (let i = 0; i < additionalImageCount; i++) {
    // Generate a unique ID for each additional image
    const imageId = randomWords({ exactly: 3, maxLength: 5 }).join('-');
    
    // Construct the URL with the generated ID
    const imageUrl = `https://source.unsplash.com/random?${productName},${imageId}`;
    additionalImages.push(imageUrl);
  }
  
  // Ensure the main image is always included
  if (!additionalImages.includes(mainImageUrl)) {
    additionalImages[0] = mainImageUrl;
  }
  
  return additionalImages;
};

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

/**
 * Cache for optimized image URLs
 */
const imageCache: Record<string, { optimizedUrl: string, timestamp: number }> = {};

/**
 * Optimizes image URLs for better performance
 */
export const optimizeImageUrl = (url: string, isHighPriority: boolean = false): string => {
  // Early return for blank URLs
  if (!url) return url;
  
  try {
    // Check cache first (with 24hr expiry)
    const cacheEntry = imageCache[url];
    const now = Date.now();
    if (cacheEntry && now - cacheEntry.timestamp < 24 * 60 * 60 * 1000) {
      console.log(`Cache hit for: ${url}`);
      return cacheEntry.optimizedUrl;
    }
    
    // Initialize optimizedUrl with the original URL
    let optimizedUrl = url;
    
    // Handle Samsung URLs first - most important fix
    if (url.includes('samsung.com')) {
      optimizedUrl = sanitizeSamsungUrl(url);
      
      // Cache the result
      imageCache[url] = { optimizedUrl, timestamp: now };
      return optimizedUrl;
    }
    
    // Handle Unsplash images
    if (url.includes('unsplash.com')) {
      // Extract the base URL and add quality parameters
      const quality = isHighPriority ? 80 : 60;
      const width = isHighPriority ? 1000 : 500;
      optimizedUrl = `${url.split('?')[0]}?q=${quality}&w=${width}&auto=format&fit=crop`;
    }
    
    // Cache the result
    imageCache[url] = { optimizedUrl, timestamp: now };
    return optimizedUrl;
  } catch (error) {
    console.error(`Error optimizing URL: ${url}`, error);
    return url; // Return original URL on error
  }
};

/**
 * Preloads images to improve user experience
 */
export const preloadImages = async (urls: string[]): Promise<Record<string, boolean>> => {
  const results: Record<string, boolean> = {};
  
  const preloadPromises = urls.map((url) => {
    return new Promise<void>((resolve) => {
      // Skip invalid URLs
      if (!url) {
        results[url] = false;
        resolve();
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        results[url] = true;
        console.log(`Successfully preloaded: ${url}`);
        resolve();
      };
      
      img.onerror = () => {
        results[url] = false;
        console.warn(`Failed to preload image: ${url}`);
        resolve();
      };
      
      // Set the src to start loading
      img.src = url;
    });
  });
  
  await Promise.all(preloadPromises);
  return results;
};

/**
 * Generates a low-quality image placeholder (LQIP) using a data URL.
 */
export const generateLowQualityImagePlaceholder = async (imageUrl: string): Promise<string | undefined> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error generating LQIP:", error);
    return undefined;
  }
};
