import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

export type DialogEventDetail = {
    dialogRef?: HTMLDialogElement;
};

@customElement("add-track-dialog")
export default class AddTrackDialog extends LitElement {
    private dialogRef: Ref<HTMLDialogElement> = createRef();

    static styles = [
        css`
            dialog {
                width: 400px;
                padding: 20px;
                border-radius: 8px;
                background-color: var(--color-primary);
                border: 1px solid var(--color-accent);
                color: var(--color-white);
            }

            dialog::backdrop {
                background-color: rgba(0, 0, 0, 0.8);
            }

            form {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
        `,
    ];

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
        this.dispatchEvent(
            new CustomEvent<DialogEventDetail>("dialog-ready", {
                bubbles: true,
                composed: true,
                detail: { dialogRef: this.dialogRef.value },
            }),
        );
    }

    render() {
        return html`
            <dialog ${ref(this.dialogRef)} id="add-track-dialog">
                <form method="dialog">
                    <h2>Add Track</h2>
                    <label for="track-name">Track Name:</label>
                    <input
                        type="text"
                        id="track-name"
                        name="track-name"
                        required
                    />

                    <label for="track-color">Track Color:</label>
                    <input
                        type="color"
                        id="track-color"
                        name="track-color"
                        value="#ffffff"
                    />

                    <button type="submit">Add Track</button>
                    <button type="button">Cancel</button>
                </form>
            </dialog>
        `;
    }
}
