
// Image optimization cache to prevent duplicate processing
const optimizationCache: Record<string, string> = {};

/**
 * Get a value from the image cache
 */
export const getFromCache = (key: string): string | null => {
  return optimizationCache[key] || null;
};

/**
 * Store a value in the image cache
 */
export const storeInCache = (key: string, value: string): void => {
  optimizationCache[key] = value;
};

/**
 * Store a JSON value in the image cache
 */
export const storeJsonInCache = (key: string, value: any): void => {
  optimizationCache[key] = JSON.stringify(value);
};

/**
 * Get a JSON value from the image cache
 */
export const getJsonFromCache = (key: string): any | null => {
  if (!optimizationCache[key]) return null;
  try {
    return JSON.parse(optimizationCache[key]);
  } catch (error) {
    console.error(`Error parsing cached JSON for key ${key}:`, error);
    return null;
  }
};
