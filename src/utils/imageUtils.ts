
/**
 * Utility functions for handling product images
 */

// Cache for storing optimized image URLs
const IMAGE_CACHE_KEY = 'evision_image_cache';
const IMAGE_DATA_CACHE_KEY = 'evision_image_data_cache';

interface ImageCacheEntry {
  url: string;
  optimizedUrl: string;
  timestamp: number;
}

interface ImageDataCacheEntry {
  url: string;
  dataUrl: string;
  timestamp: number;
  lowQuality: boolean;
}

// Get or initialize the image cache from localStorage
const getImageCache = (): Record<string, ImageCacheEntry> => {
  try {
    const cachedData = localStorage.getItem(IMAGE_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : {};
  } catch (error) {
    console.error('Error accessing image cache:', error);
    return {};
  }
};

// Get or initialize the image data cache from localStorage
const getImageDataCache = (): Record<string, ImageDataCacheEntry> => {
  try {
    const cachedData = localStorage.getItem(IMAGE_DATA_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : {};
  } catch (error) {
    console.error('Error accessing image data cache:', error);
    return {};
  }
};

// Save the image cache to localStorage
const saveImageCache = (cache: Record<string, ImageCacheEntry>): void => {
  try {
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving image cache:', error);
  }
};

// Save the image data cache to localStorage
const saveImageDataCache = (cache: Record<string, ImageDataCacheEntry>): void => {
  try {
    localStorage.setItem(IMAGE_DATA_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving image data cache:', error);
  }
};

// Clear expired entries from cache (older than 24 hours)
const clearExpiredCache = (): void => {
  const cache = getImageCache();
  const dataCache = getImageDataCache();
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  let hasChanges = false;
  Object.keys(cache).forEach(key => {
    if (now - cache[key].timestamp > ONE_DAY) {
      delete cache[key];
      hasChanges = true;
    }
  });
  
  let hasDataChanges = false;
  Object.keys(dataCache).forEach(key => {
    if (now - dataCache[key].timestamp > ONE_DAY) {
      delete dataCache[key];
      hasDataChanges = true;
    }
  });
  
  if (hasChanges) {
    saveImageCache(cache);
  }
  
  if (hasDataChanges) {
    saveImageDataCache(dataCache);
  }
};

// Properly sanitize Samsung URLs that are problematic
export const sanitizeSamsungUrl = (url: string): string => {
  if (!url) return url;
  
  if (url.includes('samsung.com')) {
    // Samsung URLs often break with query parameters
    const cleanUrl = url.split('?')[0];
    console.log(`Sanitizing Samsung URL globally: ${url} -> ${cleanUrl}`);
    return cleanUrl;
  }
  
  return url;
};

// Check if an image URL is valid
const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a local asset (which is always valid)
  if (url.startsWith('/')) return true;
  
  // Check if it looks like a valid URL
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Sanitize problematic image URLs before processing
const sanitizeImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Always sanitize Samsung URLs first as they're problematic
  return sanitizeSamsungUrl(url);
};

// Convert an image to a low-quality data URL for quick loading
export const generateLowQualityImagePlaceholder = async (url: string): Promise<string | null> => {
  // Sanitize URL first
  const sanitizedUrl = sanitizeImageUrl(url);
  
  // Check if URL is valid
  if (!isValidImageUrl(sanitizedUrl)) {
    console.warn(`Invalid image URL: ${url}`);
    return null;
  }
  
  // Check cache first
  const cache = getImageDataCache();
  const cacheKey = `${sanitizedUrl}_low`;
  
  if (cache[cacheKey] && cache[cacheKey].dataUrl) {
    return cache[cacheKey].dataUrl;
  }
  
  try {
    // Handle local URLs differently
    if (sanitizedUrl.startsWith('/')) {
      // For local images, just return the URL as we don't need to optimize
      return sanitizedUrl;
    }
    
    // For Samsung URLs, just return the sanitized URL directly
    if (sanitizedUrl.includes('samsung.com')) {
      return sanitizedUrl;
    }
    
    // Use a smaller, lower quality version for the placeholder
    const optimizedUrl = optimizeImageUrl(sanitizedUrl, false, 20, 20);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = optimizedUrl;
      
      // Set a timeout to prevent hanging on slow-loading images
      const timeout = setTimeout(() => {
        console.warn(`Placeholder generation timed out for: ${sanitizedUrl}`);
        resolve(null);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          // Create a small canvas to generate the low-res placeholder
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve(null);
            return;
          }
          
          canvas.width = 20;
          canvas.height = 20;
          
          ctx.drawImage(img, 0, 0, 20, 20);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.1);
          
          // Cache the result
          cache[cacheKey] = {
            url: sanitizedUrl,
            dataUrl,
            timestamp: Date.now(),
            lowQuality: true
          };
          saveImageDataCache(cache);
          
          resolve(dataUrl);
        } catch (error) {
          console.error('Error generating placeholder:', error);
          resolve(null);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.warn(`Failed to load image for placeholder: ${sanitizedUrl}`);
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Error generating low-quality placeholder:', error);
    return null;
  }
};

// Optimize image URL for better performance and cache the result
export const optimizeImageUrl = (
  url: string, 
  isMainImage: boolean = false,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // Sanitize URL first (especially important for Samsung URLs)
  const sanitizedUrl = sanitizeImageUrl(url);
  
  // Return original URL for invalid URLs or local assets
  if (!isValidImageUrl(sanitizedUrl)) {
    console.warn(`Invalid image URL being optimized: ${url}`);
    return getRelevantPlaceholder("default");
  }
  
  if (sanitizedUrl.startsWith('/')) {
    return sanitizedUrl;
  }
  
  // Samsung URLs: ALWAYS return the sanitized URL without any optimization
  if (sanitizedUrl.includes('samsung.com')) {
    console.log(`Using direct sanitized URL for Samsung: ${sanitizedUrl}`);
    return sanitizedUrl;
  }
  
  // Determine the size to use
  const optimizedWidth = width || (isMainImage ? 800 : 300);
  const optimizedHeight = height || null;
  
  // Check the cache first
  const cache = getImageCache();
  const cacheKey = `${sanitizedUrl}_${optimizedWidth}_${optimizedHeight}_${quality}`;
  
  if (cache[cacheKey]) {
    return cache[cacheKey].optimizedUrl;
  }
  
  // Initialize optimizedUrl variable with the sanitized URL as default
  let optimizedUrl = sanitizedUrl;
  
  // For Unsplash and other image APIs, optimize
  if (sanitizedUrl.includes('images.unsplash.com')) {
    const hasParams = sanitizedUrl.includes('?');
    const widthParam = `w=${optimizedWidth}`;
    const qualityParam = `q=${quality}`; 
    const fitParam = 'fit=max'; // Ensures that the image won't be cropped
    const formatParam = 'auto=format'; // Let Unsplash choose the best format
    
    // Add or replace width parameter
    if (hasParams) {
      if (sanitizedUrl.includes('w=')) {
        optimizedUrl = sanitizedUrl.replace(/w=\d+/, widthParam);
      } else {
        optimizedUrl = `${sanitizedUrl}&${widthParam}&${qualityParam}&${fitParam}&${formatParam}`;
      }
      
      // Replace quality if it exists
      if (optimizedUrl.includes('q=')) {
        optimizedUrl = optimizedUrl.replace(/q=\d+/, qualityParam);
      }
    } else {
      optimizedUrl = `${sanitizedUrl}?${widthParam}&${qualityParam}&${fitParam}&${formatParam}`;
    }
  }
  
  // Save to cache
  cache[cacheKey] = {
    url: sanitizedUrl,
    optimizedUrl: optimizedUrl,
    timestamp: Date.now()
  };
  saveImageCache(cache);
  
  return optimizedUrl;
};

// Preload an array of images and return a promise
export const preloadImages = (urls: string[]): Promise<Record<string, boolean>> => {
  // Clear expired cache entries
  clearExpiredCache();
  
  // Create a map to track which images are loaded
  const loadStatus: Record<string, boolean> = {};
  
  // Sanitize and filter out invalid URLs
  const validUrls = urls
    .map(url => sanitizeImageUrl(url))
    .filter(url => isValidImageUrl(url));
  
  if (validUrls.length < urls.length) {
    console.warn(`Filtered out ${urls.length - validUrls.length} invalid image URLs`);
  }
  
  const imagePromises = validUrls.map(
    (url) =>
      new Promise<void>((resolve) => {
        // Generate low-quality placeholder asynchronously (don't wait for it)
        generateLowQualityImagePlaceholder(url).catch(() => null);
        
        const img = new Image();
        
        // Special handling for Samsung URLs
        const imgUrl = url.includes('samsung.com') 
          ? sanitizeSamsungUrl(url)  // Use direct sanitized URL for Samsung
          : optimizeImageUrl(url);   // Use optimization for other URLs
          
        img.src = imgUrl;
        
        // Set a timeout to prevent hanging on slow-loading images
        const timeout = setTimeout(() => {
          console.warn(`Image preload timed out for: ${url}`);
          loadStatus[url] = false;
          resolve();
        }, 10000); // 10 seconds timeout
        
        img.onload = () => {
          clearTimeout(timeout);
          loadStatus[url] = true;
          resolve();
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          console.warn(`Failed to preload image: ${url}`);
          loadStatus[url] = false;
          resolve();
        };
      })
  );
  
  return Promise.all(imagePromises).then(() => loadStatus);
};

// Get relevant placeholder based on product name
export const getRelevantPlaceholder = (productName: string): string => {
  const lowerName = productName.toLowerCase();
  
  if (lowerName.includes("refrigerator") || lowerName.includes("fridge")) {
    return "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=1000&auto=format&fit=crop";
  } else if (lowerName.includes("tv") || lowerName.includes("frame")) {
    return "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000&auto=format&fit=crop";
  } else if (lowerName.includes("buds") || lowerName.includes("earphone")) {
    return "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop";
  } else if (lowerName.includes("vacuum") || lowerName.includes("cleaner")) {
    return "https://images.unsplash.com/photo-1620096906384-7eb3ea11bced?q=80&w=1000&auto=format&fit=crop";
  } else if (lowerName.includes("microwave")) {
    return "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=1000&auto=format&fit=crop";
  } else if (lowerName.includes("oven") || lowerName.includes("convection")) {
    return "/lovable-uploads/b0f862ff-2d78-4c70-ad25-bd7a2caf9809.png";
  } else if (lowerName.includes("soundbar") || lowerName.includes("music") || lowerName.includes("speaker")) {
    return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop";
  } else if (lowerName.includes("ac") || lowerName.includes("air conditioner") || lowerName.includes("windfree")) {
    return "https://images.unsplash.com/photo-1617784625140-430eaff5b161?q=80&w=1000&auto=format&fit=crop";
  } else {
    return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop";
  }
};

// Generate additional relevant images for thumbnails based on product type
export const generateAdditionalImages = (productName: string, mainImage: string): string[] => {
  const additionalImages = [];
  const lowerName = productName.toLowerCase();
  
  // Always include the main image first if it's valid
  if (isValidImageUrl(mainImage)) {
    additionalImages.push(mainImage);
  } else {
    // If main image is invalid, use a relevant placeholder instead
    additionalImages.push(getRelevantPlaceholder(productName));
  }
  
  // Add category-specific additional images
  if (lowerName.includes("refrigerator") || lowerName.includes("fridge")) {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1601599963565-b7f49d6cf386?q=80&w=1000&auto=format&fit=crop");
  } else if (lowerName.includes("tv") || lowerName.includes("frame")) {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1577979749830-f1d742b96791?q=80&w=1000&auto=format&fit=crop");
  } else if (lowerName.includes("buds") || lowerName.includes("earphone")) {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1548378329-437e1ef34263?q=80&w=1000&auto=format&fit=crop");
  } else if (lowerName.includes("vacuum") || lowerName.includes("cleaner")) {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1620096906384-7eb3ea11bced?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1528740096961-d519b3f91f5a?q=80&w=1000&auto=format&fit=crop");
  } else if (lowerName.includes("microwave")) {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1584269600295-5b6d3e0d7b1a?q=80&w=1000&auto=format&fit=crop");
  } else if (lowerName.includes("oven") || lowerName.includes("convection")) {
    if (additionalImages.length < 3) additionalImages.push("/lovable-uploads/b0f862ff-2d78-4c70-ad25-bd7a2caf9809.png");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1585237017125-24baf8d7406f?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1482949900613-8e0d32164d8f?q=80&w=1000&auto=format&fit=crop");
  } else if (lowerName.includes("soundbar") || lowerName.includes("music") || lowerName.includes("speaker")) {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop");
  } else if (lowerName.includes("ac") || lowerName.includes("air conditioner") || lowerName.includes("windfree")) {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1617784625140-430eaff5b161?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1000&auto=format&fit=crop");
  } else {
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop");
    if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop");
  }
  
  return additionalImages;
};
