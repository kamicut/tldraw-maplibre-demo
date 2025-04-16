import "maplibre-gl/dist/maplibre-gl.css"
import Map, {
  ScaleControl,
  AttributionControl
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

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Map
        ref={mapRef}
        viewState={{
          longitude: center[0],
          latitude: center[1],
          zoom: zoom
        }}
        style={{ width, height }}
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                "https://api.mapbox.com/styles/v1/devseed/cm4sj2dh6005b01s80c8t623r/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q"
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
        reuseMaps={true}
        trackResize={true}
        interactive={true}
        dragRotate={false}
        doubleClickZoom={true}
        touchZoomRotate={true}
        touchPitch={true}
      >
        <ScaleControl position="bottom-right" />
        <AttributionControl position="bottom-left" />
      </Map>
    </div>
  )
} 