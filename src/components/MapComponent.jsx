import "maplibre-gl/dist/maplibre-gl.css"
import Map, {
  ScaleControl,
  NavigationControl
} from 'react-map-gl/maplibre'

import * as React from 'react';

export function MapComponent({
  center,
  zoom,
  width,
  height
}) {
  const mapRef = React.useRef();
  const containerRef = React.useRef();
  const [viewState, setViewState] = React.useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom
  });

  // Update viewState when props change
  React.useEffect(() => {
    setViewState({
      longitude: center[0],
      latitude: center[1],
      zoom: zoom
    });
  }, [center, zoom, height, width]);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleMove = (evt) => {
    setViewState(evt.viewState);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: width || '100%',
        height: height || '100%',
        position: 'relative',
        minHeight: '400px' // Ensure minimum height
      }}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        style={{ width: '100%', height: '100%' }}
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [{
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 19
          }]
        }}
        interactive={true}
        dragRotate={false}
        doubleClickZoom={true}
        touchZoomRotate={true}
        touchPitch={true}
      >
        <ScaleControl position="bottom-left" />
        <NavigationControl position="top-right" />
      </Map>
    </div>
  )
} 