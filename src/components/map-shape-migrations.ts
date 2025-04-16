import {
  createShapePropsMigrationIds,
  createShapePropsMigrationSequence,
} from "@tldraw/tldraw";

const versions = createShapePropsMigrationIds("map", {
  AddCenterAndZoom: 1,
});

export const mapShapeMigrations = createShapePropsMigrationSequence({
  sequence: [
    {
      id: versions.AddCenterAndZoom,
      up(props) {
        props.center = [-74.5, 40];
        props.zoom = 9;
      },
      down(props) {
        delete props.center;
        delete props.zoom;
      },
    },
  ],
});
