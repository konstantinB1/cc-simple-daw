export function html(strings: TemplateStringsArray, ...values: any[]): Node {
    const template = document.createElement("template");
    template.innerHTML = strings.reduce((result, str, i) => {
        return result + str + (i < values.length ? values[i] : "");
    }, "");

    return template.content.cloneNode(true);
}

export function registerElement(name: string, element: any): void {
    if (!customElements.get(name)) {
        customElements.define(name, element);
    }
}

export function createShadowHtml(element: HTMLElement, template: string): void {
    const shadow = element.attachShadow({ mode: "open" });
    shadow.innerHTML = template;
}

export function stringify<T>(obj: T): string {
    return JSON.stringify(obj).replace(/"/g, "&quot;");
}
