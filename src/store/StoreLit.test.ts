import { html, LitElement } from "lit";
import Store from "./Store";
import { storeSubscriber } from "./StoreLit";
import { customElement, property } from "lit/decorators.js";

const initialNumbers = [1, 23, 4];
const store = new Store({
    data: initialNumbers,
});

@customElement("test-element")
class TestElement extends LitElement {
    @storeSubscriber(store, (state) => state.data)
    property!: number[];

    @property({ type: Array })
    numbers!: number[];

    protected render(): unknown {
        return html`<div class="num">
            <button
                @click=${() => {
                    store.setState((state) => {
                        state.data.push(...this.numbers);
                    });
                }}
            ></button>
            <p>numbers are ${this.property.join(",")}</p>
        </div>`;
    }
}

let element: TestElement;

describe("StoreLit", () => {
    describe("storeSubscriber", () => {
        beforeEach(() => {
            element = document.createElement("test-element") as TestElement;
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
        });

        it("should initialize and react to changes", async () => {
            element.numbers =
                Math.random() > 0.5 ? [34234, 23, 23, 23, 23, 1] : [4, 5, 6];

            expect(element.property).toEqual(initialNumbers);

            await element.updateComplete;
            element.shadowRoot!.querySelector("button")!.click();
            await element.updateComplete;

            const contents =
                element.shadowRoot!.querySelector("p")!.textContent;
            expect(contents).toContain(element.numbers.join(","));
        });
    });
});
