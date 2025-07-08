export function assert(cond: boolean, msg: string) {
    if (process.env.NODE_ENV !== "development") {
        return;
    }

    if (!cond) {
        throw new Error(msg);
    }
}

export function fromCamelToPascalCase(str: string): string {
    return str.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
}

export function once(fn: (...args: any[]) => void): (...args: any[]) => void {
    let called = false;
    return (...args: any[]) => {
        if (!called) {
            called = true;
            fn(...args);
        }
    };
}

export class ObjectPath {
    static get(obj: Record<string, any>, path: string): any {
        return path
            .split(".")
            .reduce((o, key) => (o ? o[key] : undefined), obj);
    }

    static set(obj: Record<string, any>, path: string, value: any): void {
        const keys = path.split(".");
        const lastKey = keys.pop();
        const target = keys.reduce((o, key) => (o[key] = o[key] || {}), obj);
        if (lastKey) {
            target[lastKey] = value;
        }
    }
}
