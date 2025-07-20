import Store from "@/store/Store";
import { helperStyles } from "@/styles";

export const defaultThemeState = {
    mode: "light",
    palette: {
        primary: "#ffffff",
        secondary: "#000000",
        background: "#f0f0f0",
        text: "#333333",
        border: "#dddddd",
    },
};

export type ThemeState = typeof helperStyles;

export class ThemeStore extends Store<ThemeState> {
    constructor(theme: ThemeState) {
        super(theme);
    }
}

export default class ThemedElement {}
