import { LitElement } from "lit";
import { property } from "lit/decorators.js";

type Constructor<T = {}> = new (...args: any[]) => T;

const WithRequiredProps = <
    T extends Constructor<LitElement>,
    P extends Record<string, any>,
>(
    superclass: T & P,
    props: P = {} as P,
) => {
    class BaseClass extends superclass {
        constructor(...args: any[]) {
            super(...args);
            Object.keys(props).forEach((key) => {
                if (props[key] !== undefined) {
                    this[key] = props[key];
                }
            });
        }
    }

    return BaseClass;
};

export default WithRequiredProps;
