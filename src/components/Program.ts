import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { typography } from "../global-styles";
import ProgramManager from "../lib/ProgramManager";
import type { SelectData, SelectOption } from "./Select";

@customElement("program-container")
export default class Program extends LitElement {
    private programManager: ProgramManager = ProgramManager.getInstance();

    constructor() {
        super();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.loadDefaultProgram();
    }

    private get programNames(): SelectOption[] {
        return this.programManager.programNames.map((program) => ({
            label: program,
            value: program,
        }));
    }

    private async loadDefaultProgram() {
        const defaultProgram = import.meta.env.VITE_DEFAULT_PROGRAM;

        if (!defaultProgram) {
            throw new Error("Default program not set");
        }

        try {
            await this.programManager.load(defaultProgram);
        } catch (error) {}
    }

    static styles = [
        typography,
        css`
            .container {
                padding: 20px 0;
            }
        `,
    ];

    private async handleSelectProgram({
        detail: { value },
    }: CustomEvent<SelectData>) {
        try {
            await this.programManager.load(value);
        } catch (error) {
            throw new Error("Failed to load program");
        }
    }

    render() {
        return html`
            <section class="container">
                <h1 class="typography-100">
                    <daw-select
                        .options=${this.programNames}
                        @select-data=${this.handleSelectProgram}
                    />
                </h1>
            </section>
        `;
    }
}
