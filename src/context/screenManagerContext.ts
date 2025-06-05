import PanelScreenManager from "@/lib/PanelScreenManager";
import { createContext } from "@lit/context";

const screenManagerContext = createContext<PanelScreenManager>(
    Symbol("screenManagerContext"),
);

export const screenManager = new PanelScreenManager();

export default screenManagerContext;
