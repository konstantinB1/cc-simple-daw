export function getShadowParent(element: HTMLElement): ShadowRoot | null {
    if (element.shadowRoot) {
        return element.shadowRoot;
    }

    if (element.parentElement) {
        return getShadowParent(element.parentElement);
    }

    return null;
}
