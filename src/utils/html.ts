export default function createExternalElement(
    tagName: string,
    className: string,
    attributes: Record<string, string> = {},
    styles: string[] = [],
): HTMLElement {
    const element = document.createElement(tagName);
    element.className = className;

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    if (styles.length > 0) {
        const styleElement = document.createElement("style");
        styleElement.textContent = styles.join("\n");
        element.appendChild(styleElement);
    }

    return element;
}
