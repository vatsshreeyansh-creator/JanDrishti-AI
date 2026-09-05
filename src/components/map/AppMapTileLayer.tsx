import React from 'react';
import { TileLayer } from 'react-leaflet';
import { useTheme } from '../../context/ThemeContext';
import { getMapTileConfig } from '../../config/mapConfig';

export interface AppMapTileLayerProps {
  /**
   * Optional override if a specific view requires a forced theme (e.g. 'dark' or 'light').
   * If omitted, adapts automatically to the global JanDrishti theme.
   */
  forcedTheme?: 'light' | 'dark';
}

/**
 * AppMapTileLayer:
 * Reusable map tile layer for JanDrishti.
 * Connects directly to the centralized map provider configuration and adapts to the active theme.
 * Replaces hardcoded TileLayer instances throughout the application.
 */
export const AppMapTileLayer: React.FC<AppMapTileLayerProps> = ({ forcedTheme }) => {
  const { theme } = useTheme();
  const activeTheme = forcedTheme || theme;
  const config = getMapTileConfig(activeTheme);

  return (
    <TileLayer
      key={`${config.provider}-${activeTheme}-${config.url}`}
      url={config.url}
      attribution={config.attribution}
      maxZoom={config.maxZoom}
      subdomains={config.subdomains}
    />
  );
};

export default AppMapTileLayer;
