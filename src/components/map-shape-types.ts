import { TLBaseShape } from "@tldraw/tldraw";

export interface IMapShape extends TLBaseShape<"map", MapShapeProps> {
  type: "map";
  props: MapShapeProps;
}

export interface MapShapeProps {
  w: number;
  h: number;
  center: number[];
  zoom: number;
}
