import {
  BaseBoxShapeTool,
  TLClickEventInfo,
  TLPointerEventInfo,
  TLWheelEventInfo,
} from "@tldraw/tldraw";

export class MapTool extends BaseBoxShapeTool {
  static id = "map";
  static initial = "idle";
  static shortcut = ["m", "a", "p"];

  shapeType = "map";
}
