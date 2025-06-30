import { createContext } from "@lit/context";

export const panelContext = createContext(Symbol("panelContext"));

export interface PanelContextInterface {
    name: string;
    isVisible: boolean;
    isDraggable: boolean;
    isFocused: boolean;
    isResizable: boolean;
    width: number;
    height: number;
}
