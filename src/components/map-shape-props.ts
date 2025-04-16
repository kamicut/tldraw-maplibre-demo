import { RecordProps, T } from "@tldraw/tldraw";
import { IMapShape } from "./map-shape-types";

export const mapShapeProps: RecordProps<IMapShape> = {
  w: T.number,
  h: T.number,
  center: T.arrayOf(T.number),
  zoom: T.number,
};
