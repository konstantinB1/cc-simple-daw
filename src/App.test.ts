import { html, LitElement } from "lit";
import "./App";
import type { AppElement } from "./App";

let element: AppElement;

const hoisted = vi.hoisted(() => ({
    createGlobalStylesheet: vi.fn(),
    themeVars: {},
}));

vi.mock("@modules/view/View", () => ({
    default: class MockAppView extends LitElement {
        render() {
            return html`<div>Mock App View</div>`;
        }
    },
}));

vi.mock("./styles", () => ({
    themeVars: hoisted.themeVars,
    createGlobalStylesheet: hoisted.createGlobalStylesheet,
}));

describe("App", () => {
    beforeEach(() => {
        element = document.createElement("root-app");
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it("should render app-view", () => {
        expect(element.shadowRoot?.children.length).toBe(2);
        expect(element.shadowRoot?.querySelector("app-view")).toBeInstanceOf(
            HTMLElement,
        );
    });

    it("should apply global styles", () => {
        expect(hoisted.createGlobalStylesheet).toHaveBeenCalled();
        expect(element.shadowRoot?.querySelector("style")).toBeDefined();
    });

    it("should have a signal context provider with initial value", () => {
        const signalContext = element.signalContext;
        expect(signalContext).toBeDefined();
    });
});
