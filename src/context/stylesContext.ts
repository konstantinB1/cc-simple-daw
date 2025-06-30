import type { themeVars } from "@/styles";
import StyleManager from "@/utils/stylesheets";
import { createContext } from "@lit/context";

export const stylesContext = createContext<StyleManager<typeof themeVars>>(
    Symbol("stylesContext"),
);
