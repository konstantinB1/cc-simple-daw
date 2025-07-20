import { helperStyles } from "@/styles";
import { TempStylesheet } from "@/utils/stylesheets";
import { css, html, render } from "lit";

export default class Backdrop {
    private static element: HTMLElement;

    static isVisible: boolean = false;

    static create() {
        if (!Backdrop.element) {
            const backdropStyles = new TempStylesheet("backdrop-styles", [
                css`
                    .backdrop {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 1000;
                    }

                    ${helperStyles},
                `,
            ]);

            backdropStyles.attachToHost();

            render(
                html`<div
                    class="full-space fixed top left hidden cursor-pointer z-backdrop"
                    id="global-backdrop"
                ></div>`,
                document.body,
                {
                    host: Backdrop.element,
                    creationScope: document,
                },
            );

            this.element = document.querySelector(
                "#global-backdrop",
            ) as HTMLElement;
        }
    }

    static toggle() {
        Backdrop.isVisible = !Backdrop.isVisible;
        Backdrop.element.classList.toggle("hidden", !Backdrop.isVisible);
    }

    static show() {
        if (!Backdrop.element) {
            Backdrop.create();
        }

        Backdrop.isVisible = true;
        Backdrop.element.classList.remove("hidden");
    }

    static hide() {
        if (!Backdrop.element) {
            Backdrop.create();
        }
        Backdrop.isVisible = false;
        Backdrop.element.classList.add("hidden");
    }

    static onClick(callback: (event: MouseEvent) => void) {
        if (!Backdrop.element) {
            Backdrop.create();
        }

        Backdrop.element.addEventListener("click", callback);
    }
}
