export function assert(cond: boolean, msg: string) {
    if (process.env.NODE_ENV !== "development") {
        return;
    }

    if (!cond) {
        throw new Error(msg);
    }
}

export function fromCamelToPascalCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
