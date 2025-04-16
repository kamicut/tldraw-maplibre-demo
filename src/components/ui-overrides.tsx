import React from "react";
import {
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiOverrides,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
} from "tldraw";

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    return {
      ...tools,
      map: {
        id: "map",
        icon: "mixed",
        label: "Map",
        kbd: "m",
        onSelect: () => {
          editor.setCurrentTool("map");
        },
      },
    };
  },
};

export const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools();
    const isMapSelected = useIsToolSelected(tools["map"]);
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem {...tools["map"]} isSelected={isMapSelected} />
        <DefaultToolbarContent />
      </DefaultToolbar>
    );
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools();
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <TldrawUiMenuItem {...tools["map"]} />
        <DefaultKeyboardShortcutsDialogContent />
      </DefaultKeyboardShortcutsDialog>
    );
  },
};
