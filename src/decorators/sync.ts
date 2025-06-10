import type { Context } from "@lit/context";
import type { ReactiveElement } from "lit";
import { ContextConsumerLite } from "./ContextConsumerLite";

export function consumeProp<T>({
    context,
    subscribe,
}: {
    context: Context<unknown, T>;
    subscribe?: boolean;
}) {
    return (protoOrTarget: any, nameOrContext: PropertyKey) => {
        (protoOrTarget.constructor as typeof ReactiveElement).addInitializer(
            (element: ReactiveElement): void => {
                let prevValue: PropertyKey | undefined = undefined;
                new ContextConsumerLite(element, {
                    context,
                    subscribe,
                    callback: (value) => {
                        const next = value[nameOrContext as keyof T];
                        if (prevValue === undefined || prevValue !== next) {
                            (element as any)[nameOrContext as keyof T] = next;

                            element.requestUpdate(
                                nameOrContext as PropertyKey,
                                prevValue,
                            );
                        }

                        prevValue = next as PropertyKey;
                    },
                });
            },
        );
    };
}

// Consume multiple properties from a single context object.
export function consumeMultipleProps<T>({
    context,
    subscribe,
    props,
}: {
    context: Context<unknown, T>;
    subscribe?: boolean;
    props: (keyof T)[];
}) {
    return (protoOrTarget: any, names: (keyof T)[]) => {
        (protoOrTarget.constructor as typeof ReactiveElement).addInitializer(
            (element: ReactiveElement): void => {
                const prevValues: Record<PropertyKey, PropertyKey | undefined> =
                    {};

                console.log(names);

                names.forEach((name) => {
                    prevValues[name] = undefined;
                });

                new ContextConsumerLite(element, {
                    context,
                    subscribe,
                    callback: (value) => {
                        names.forEach((name) => {
                            const next = value[name as keyof T];
                            if (
                                prevValues[name] === undefined ||
                                prevValues[name] !== next
                            ) {
                                (element as any)[name as keyof T] = next;

                                element.requestUpdate(
                                    name as PropertyKey,
                                    prevValues[name],
                                );
                            }
                            prevValues[name] = next as PropertyKey;
                        });
                    },
                });
            },
        );
    };
}
