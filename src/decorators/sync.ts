import type { Context } from "@lit/context";
import type { ReactiveElement } from "lit";
import { ContextConsumerCustom } from "./consumer2";

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
                new ContextConsumerCustom(element, {
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
