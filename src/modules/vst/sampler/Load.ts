import type { SelectData, SelectOption } from "@/components/Select";
import { typography } from "@/global-styles";
import ProgramManager from "@/lib/ProgramManager";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

export type ProgramLoadedData = {
    program: any;
};

@customElement("program-container")
export default class Program extends LitElement {
    private programManager: ProgramManager = ProgramManager.getInstance();

    static styles = [
        typography,
        css`
            .container {
                padding: 20px 0;
            }
        `,
    ];

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
            const prog = await this.programManager.load(defaultProgram);
            this.emitProgramToParent(prog);
        } catch (error) {
            throw new Error("Failed to load default program");
        }
    }

    private async handleSelectProgram({
        detail: { value },
    }: CustomEvent<SelectData>) {
        try {
            const currentProgram = await this.programManager.load(value);
            this.emitProgramToParent(currentProgram);
        } catch (error) {
            throw new Error("Failed to load program");
        }
    }

    private emitProgramToParent(data: any) {
        this.dispatchEvent(
            new CustomEvent<ProgramLoadedData>("program-loaded", {
                detail: { program: data },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        return html`
            <section class="container">
                <daw-select
                    .options=${this.programNames}
                    @select-data=${this.handleSelectProgram}
                >
                </daw-select>
            </section>
        `;
    }
}
