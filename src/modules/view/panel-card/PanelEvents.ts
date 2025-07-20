export class PanelDragEvent extends Event {
    static readonly type = "panel-drag";
    static readonly bubbles = true;
    static readonly cancelable = true;

    isDragging: boolean;
    cardId: string;
    position: [number, number];

    constructor(
        public readonly panelId: string,
        pos: [number, number],
        isDragging: boolean = false,
    ) {
        super(PanelDragEvent.type, {
            bubbles: true,
            cancelable: true,
            composed: true,
        });

        this.cardId = panelId;
        this.position = pos;
        this.isDragging = isDragging;
    }
}
