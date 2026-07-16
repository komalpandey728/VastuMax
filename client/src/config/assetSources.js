/**
 * Central config for demo vehicle imagery, 3D models, and external APIs.
 * Swap env vars or URLs here when moving to real vendor photography.
 */

export const ASSET_SOURCES = {
  pexels: {
    apiUrl: 'https://api.pexels.com/v1/search',
    apiKey: import.meta.env.VITE_PEXELS_API_KEY || '',
  },
  unsplash: {
    apiUrl: 'https://api.unsplash.com/search/photos',
    accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '',
  },
  modelViewer: {
    baseUrl: 'https://modelviewer.dev/shared-assets/models/',
    samples: {
      commercial: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
    },
  },
  sketchfab: {
    searchUrl: 'https://sketchfab.com/search?q=car&type=models&features=downloadable&license=cc0',
  },
  polyPizza: {
    baseUrl: 'https://poly.pizza',
  },
};

/** Standard angle tags for gallery / 360° photo-spin */
export const IMAGE_ANGLES = [
  'front',
  'rear',
  'side-left',
  'side-right',
  'interior-dash',
  'interior-seats',
  'boot',
  'wheel',
  'engine-bay',
  'top',
];

/**
 * Build a demo multi-angle image set for a vehicle using Unsplash source URLs.
 * @param {string} seed - unique seed per vehicle for consistent images
 */
export const buildDemoAngleImages = (seed, category = 'car') => {
  const base = category === 'commercial' ? 'truck' : 'car';
  return IMAGE_ANGLES.map((angle, i) => ({
    url: `https://images.unsplash.com/photo-${1500000000000 + seed * 100 + i}?auto=format&fit=crop&w=1200&q=80`,
    angle,
  }));
};

/** Fallback placeholder when an image fails to load */
export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80';

export default ASSET_SOURCES;
