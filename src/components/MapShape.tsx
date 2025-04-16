import React, { useState } from "react";
import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLResizeInfo,
  getDefaultColorTheme,
  resizeBox,
} from "@tldraw/tldraw";
import { IMapShape, MapShapeProps } from "./map-shape-types";
import { mapShapeProps } from "./map-shape-props";
import { MapComponent } from "./MapComponent";

export class MapShapeUtil extends ShapeUtil<IMapShape> {
  static type = "map" as const;
  static props = mapShapeProps;

  canBind = () => false;
  canEdit = () => true;
  canResize = () => true;
  canRotate = () => false;

  getDefaultProps(): MapShapeProps {
    return {
      w: 800,
      h: 600,
      center: [0, 0],
      zoom: 0,
    };
  }

  getGeometry(shape: IMapShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: IMapShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [localZoom, setLocalZoom] = useState(shape.props.zoom);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [localCenter, setLocalCenter] = useState(shape.props.center);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [searchQuery, setSearchQuery] = useState("");

    const handleZoomIn = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalZoom((prevZoom) => prevZoom + 1);
    };

    const handleZoomOut = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalZoom((prevZoom) => prevZoom - 1);
    };

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setLocalCenter([parseFloat(lon), parseFloat(lat)]);
          setLocalZoom(12); // Zoom to a reasonable level for viewing a location
        }
      } catch (error) {
        console.error("Error searching location:", error);
      }
    };

    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: theme.background,
          pointerEvents: "all",
        }}
      >
        <MapComponent
          center={localCenter}
          zoom={localZoom}
          width={bounds.w}
          height={bounds.h}
        />

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            background: "white",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location..."
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "200px",
              }}
              onPointerDown={(e) => e.stopPropagation()}
            />
            <button
              type="submit"
              style={{
                padding: "8px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              Search
            </button>
          </div>
        </form>

        {/* Zoom controls */}
        <div
          style={{
            position: "absolute",
            top: 70, // Position below the search bar
            right: 10,
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            zIndex: 1,
          }}
        >
          <button
            onClick={handleZoomIn}
            style={{
              padding: "8px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              padding: "8px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            -
          </button>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: IMapShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={4} ry={4} />;
  }

  onResize(shape: IMapShape, info: TLResizeInfo<IMapShape>) {
    const resized = resizeBox(shape, info);

    return {
      ...resized,
      props: {
        ...resized.props,
        zoom: shape.props.zoom,
      },
    };
  }
}
