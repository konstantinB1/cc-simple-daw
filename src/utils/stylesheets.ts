import type { CSSResult } from "lit";
import { fromCamelToPascalCase } from "./utils";

export const arrToStr = <T>(arr: T[]) => arr.filter(Boolean).join(" ");

class CSSVariable {
    name: string;
    value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    toString(): string {
        return `--${fromCamelToPascalCase(this.name)}: ${this.value};`;
    }
}

export class Theme<T extends Record<string, any>> extends EventTarget {
    data: T;

    textContent: string = "";

    vars: Set<CSSVariable> = new Set();

    styleElement?: HTMLStyleElement;

    styleSheet?: CSSStyleSheet = new CSSStyleSheet();

    constructor(data: T) {
        super();
        this.data = data;

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === "string" || typeof value === "number") {
                this.registerVariable(key, value);
            }
        }
    }

    registerVariable(name: string, value: any) {
        (this.data as Record<string, any>)[name] = value;
        const cssVar = new CSSVariable(
            fromCamelToPascalCase(name),
            value.toString(),
        );

        this.vars.add(cssVar);
    }

    createTheme() {
        if (this.textContent) {
            throw new Error("Theme content is already created.");
        }

        if (this.vars.size === 0) {
            throw new Error("No CSS variables registered in the theme.");
        }

        this.textContent = this.toCssRule();

        this.dispatchEvent(
            new CustomEvent("theme-created", {
                detail: this.textContent,
                bubbles: true,
                composed: true,
            }),
        );
    }

    toCssRule() {
        let cssText = ":root {\n";

        this.vars.forEach(({ name, value }) => {
            cssText += `--${name}: ${value};\n`;
        });

        cssText += "}\n";

        return cssText;
    }

    attachToHost(host: Document = document): Theme<T> {
        if (!host) {
            throw new Error("Host element is required to attach the theme.");
        }

        const styleElement = host.createElement("style");
        styleElement.textContent = this.toCssRule();
        styleElement.id = "css-theme-compat";

        host.head.appendChild(styleElement);

        return this;
    }

    toCssProp(key: string): string {
        return `var(--${key})`;
    }
}

export default class StyleManager<T extends Record<string, any>> {
    stylesheets: StyleSheetList = document.styleSheets;

    theme: Theme<T> | null = null;

    globalStylesheet: CSSStyleSheet = new CSSStyleSheet();

    constructor(theme?: Theme<T>) {
        this.theme = theme || null;
    }

    hasStylesheet(id: string): boolean {
        for (let i = 0; i < this.stylesheets.length; i++) {
            const stylesheet = this.stylesheets[i];
            if (
                stylesheet instanceof CSSStyleSheet &&
                stylesheet.ownerNode instanceof Element &&
                stylesheet.ownerNode.id === id
            ) {
                return true;
            }
        }

        return false;
    }

    loadGlobalStylesheet(styles: string) {
        if (this.globalStylesheet.cssRules.length > 0) {
            return;
        }

        this.globalStylesheet.replaceSync(styles);
        this.theme!.textContent += styles;

        document.adoptedStyleSheets = [
            ...document.adoptedStyleSheets,
            this.globalStylesheet,
        ];
    }

    createStyleElement(id: string, styles: CSSResult | CSSResult[]): void {
        if (this.hasStylesheet(id)) {
            return;
        }

        const styleElement = document.createElement("style");
        styleElement.id = id;

        if (typeof styles === "string") {
            styleElement.textContent = styles;
        } else if (Array.isArray(styles)) {
            styleElement.textContent = styles.map((s) => s.cssText).join("\n");
        } else if (styles instanceof CSSStyleSheet) {
            styleElement.textContent = styles.cssText;
        }

        this.theme!.styleElement = styleElement;

        styleElement.type = "text/css";
        styleElement.setAttribute("data-daw-style", id);
        styleElement.setAttribute("data-daw-style-type", "stylesheet");

        document.head.appendChild(styleElement);
    }

    createStyleSheet(
        id: string,
        styles: CSSResult | CSSResult[] | string,
    ): CSSStyleSheet {
        if (this.hasStylesheet(id)) {
            return this.get(id) as CSSStyleSheet;
        }

        const styleSheet = new CSSStyleSheet();
        if (typeof styles === "string") {
            styleSheet.replaceSync(styles);
        } else if (Array.isArray(styles)) {
            styles.forEach((s) => styleSheet.replaceSync(s.cssText));
        } else if (styles instanceof CSSStyleSheet) {
            styleSheet.replaceSync(styles.cssText);
        }

        return styleSheet;
    }

    get(id: string): CSSStyleSheet | null {
        for (let i = 0; i < this.stylesheets.length; i++) {
            const stylesheet = this.stylesheets[i];
            if (
                stylesheet instanceof CSSStyleSheet &&
                stylesheet.ownerNode instanceof Element &&
                stylesheet.ownerNode.id === id
            ) {
                return stylesheet;
            }
        }

        return null;
    }
}
