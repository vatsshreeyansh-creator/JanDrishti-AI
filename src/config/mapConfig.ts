/**
 * JanDrishti AI - Centralized Map Provider Configuration
 *
 * This module isolates all map provider configurations (MapmyIndia, CartoDB, OSM, Mapbox, Custom).
 * The rest of the application imports getMapTileConfig() or <AppMapTileLayer />,
 * ensuring zero coupling to any single map provider.
 *
 * Provider credentials are read from Vite environment variables and NEVER hardcoded:
 * - VITE_MAP_PROVIDER: 'mapmyindia' | 'carto' | 'osm' | 'mapbox' | 'custom' (defaults to 'mapmyindia')
 * - VITE_MAPMYINDIA_KEY / VITE_MAP_API_KEY: Provider API key
 * - VITE_MAP_CUSTOM_TILE_URL: Optional custom tile URL template
 */

export type MapProvider = 'mapmyindia' | 'carto' | 'osm' | 'mapbox' | 'custom';

export interface MapTileConfig {
  provider: MapProvider;
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string[];
  isFallback: boolean;
}

// Read configuration from Vite environment variables
const MAP_PROVIDER = (import.meta.env.VITE_MAP_PROVIDER || 'mapmyindia').toLowerCase() as MapProvider;
const MAP_API_KEY = (import.meta.env.VITE_MAPMYINDIA_KEY || import.meta.env.VITE_MAP_API_KEY || '').trim();
const CUSTOM_TILE_URL = (import.meta.env.VITE_MAP_CUSTOM_TILE_URL || '').trim();

// Fallback tile configurations (CartoDB Voyager / Dark Matter & OSM)
const CARTO_TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://carto.com/" target="_blank" rel="noopener noreferrer">Carto</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c', 'd'],
  maxZoom: 19,
};

const OSM_TILES = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
  subdomains: ['a', 'b', 'c'],
  maxZoom: 19,
};

/**
 * Returns the active configured map provider identifier.
 */
export const getActiveMapProvider = (): MapProvider => MAP_PROVIDER;

/**
 * Returns whether an API key has been supplied.
 */
export const hasMapApiKey = (): boolean => Boolean(MAP_API_KEY);

/**
 * Returns the active tile layer configuration based on provider, credentials, and UI theme.
 * Gracefully falls back to Carto if the required key is missing, ensuring zero downtime or UI breakage.
 */
export const getMapTileConfig = (theme: 'light' | 'dark' = 'dark'): MapTileConfig => {
  // 1. Custom tile URL specified
  if (MAP_PROVIDER === 'custom' && CUSTOM_TILE_URL) {
    return {
      provider: 'custom',
      url: CUSTOM_TILE_URL.replace('{apiKey}', MAP_API_KEY),
      attribution: '&copy; Custom Map Provider',
      maxZoom: 19,
      isFallback: false,
    };
  }

  // 2. MapmyIndia (Mappls)
  if (MAP_PROVIDER === 'mapmyindia') {
    if (MAP_API_KEY) {
      return {
        provider: 'mapmyindia',
        // Standard Mappls raster tile API endpoint for Leaflet tile layers
        url: `https://apis.mappls.com/advancedmaps/v1/${MAP_API_KEY}/still_map/{z}/{x}/{y}.png`,
        attribution: '&copy; <a href="https://www.mappls.com/" target="_blank" rel="noopener noreferrer">Mappls | MapmyIndia</a>',
        maxZoom: 18,
        isFallback: false,
      };
    }

    // Key not supplied yet: warn once in development and fall back seamlessly to Carto
    if (import.meta.env.DEV) {
      console.info(
        '[JanDrishti Map] VITE_MAPMYINDIA_KEY is not set. Falling back to Carto tiles. ' +
        'Set VITE_MAPMYINDIA_KEY in your .env or Vercel environment to activate MapmyIndia.'
      );
    }

    return {
      provider: 'carto',
      url: theme === 'dark' ? CARTO_TILES.dark : CARTO_TILES.light,
      attribution: CARTO_TILES.attribution,
      subdomains: CARTO_TILES.subdomains,
      maxZoom: CARTO_TILES.maxZoom,
      isFallback: true,
    };
  }

  // 3. Mapbox (if configured later)
  if (MAP_PROVIDER === 'mapbox') {
    if (MAP_API_KEY) {
      const style = theme === 'dark' ? 'dark-v11' : 'streets-v12';
      return {
        provider: 'mapbox',
        url: `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAP_API_KEY}`,
        attribution: '&copy; <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer">Mapbox</a>',
        maxZoom: 19,
        isFallback: false,
      };
    }
  }

  // 4. OpenStreetMap
  if (MAP_PROVIDER === 'osm') {
    return {
      provider: 'osm',
      url: OSM_TILES.url,
      attribution: OSM_TILES.attribution,
      subdomains: OSM_TILES.subdomains,
      maxZoom: OSM_TILES.maxZoom,
      isFallback: false,
    };
  }

  // Default: Carto (theme-aware)
  return {
    provider: 'carto',
    url: theme === 'dark' ? CARTO_TILES.dark : CARTO_TILES.light,
    attribution: CARTO_TILES.attribution,
    subdomains: CARTO_TILES.subdomains,
    maxZoom: CARTO_TILES.maxZoom,
    isFallback: false,
  };
};
