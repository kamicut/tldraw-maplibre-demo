import React, { useState } from "react";
import {
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLResizeInfo,
  getDefaultColorTheme,
  resizeBox,
  Vec,
} from "@tldraw/tldraw";
import { IMapShape, MapShapeProps } from "./map-shape-types";
import { mapShapeProps } from "./map-shape-props";
import { MapComponent } from "./MapComponent";

export class MapShapeUtil extends ShapeUtil<IMapShape> {
  static type = "map" as const;
  static props = mapShapeProps;

  canBind = () => true;
  canEdit = () => true;
  canResize = () => true;
  canRotate = () => false;
  override canScroll = () => true;

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

  getOutline(shape: IMapShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    const { w, h } = bounds;

    // Define points on the outline where arrows can snap to
    return [
      // Center points of each edge
      Vec.Med(bounds.point, Vec.Add(bounds.point, new Vec(w, 0))), // Top center
      Vec.Med(
        Vec.Add(bounds.point, new Vec(w, 0)),
        Vec.Add(bounds.point, new Vec(w, h))
      ), // Right center
      Vec.Med(
        Vec.Add(bounds.point, new Vec(w, h)),
        Vec.Add(bounds.point, new Vec(0, h))
      ), // Bottom center
      Vec.Med(Vec.Add(bounds.point, new Vec(0, h)), bounds.point), // Left center
      // Corners
      bounds.point, // Top left
      Vec.Add(bounds.point, new Vec(w, 0)), // Top right
      Vec.Add(bounds.point, new Vec(w, h)), // Bottom right
      Vec.Add(bounds.point, new Vec(0, h)), // Bottom left
    ];
  }

  component(shape: IMapShape) {
    const isEditing = this.editor.getEditingShapeId() === shape.id;

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

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Search initiated with query:", searchQuery);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await response.json();
        console.log("Search results:", data);

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newCenter = [parseFloat(lon), parseFloat(lat)];
          const newZoom = 12; // Zoom to a reasonable level for viewing a location

          console.log("New center and zoom:", { newCenter, newZoom });

          // Update local state
          setLocalCenter(newCenter);
          setLocalZoom(newZoom);

          // Update the shape's props
          const updatedProps = {
            ...shape.props,
            center: newCenter,
            zoom: newZoom,
          };
          console.log("Updating shape with props:", updatedProps);

          this.editor.updateShape<IMapShape>({
            id: shape.id,
            type: shape.type,
            props: updatedProps,
          });
        } else {
          console.log("No search results found");
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
          pointerEvents: isEditing ? "all" : "none",
        }}
        onPointerDown={isEditing ? (e) => e.stopPropagation() : undefined}
      >
        <MapComponent
          center={localCenter}
          zoom={localZoom}
          width={bounds.w}
          height={bounds.h}
        />

        <form
          onSubmit={handleSearch}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
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
