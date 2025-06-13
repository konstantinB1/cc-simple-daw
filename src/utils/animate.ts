export type FadeAnimation = {
    in: () => void;
    out: () => void;
};

export function fade(
    element: HTMLElement,
    duration: number = 300,
    delay: number = 0,
    onFinish?: () => void,
): {
    in: () => void;
    out: () => void;
} {
    const fadeImpl = (fadeIn: boolean): void => {
        const keyframes: Keyframe[] = fadeIn
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [{ opacity: 1 }, { opacity: 0 }];
        element.animate(keyframes, {
            duration,
            easing: "ease-in-out",
            fill: "forwards",
            delay,
        }).onfinish = () => {
            if (!fadeIn) {
                element.style.display = "none";
            }

            onFinish?.();
        };

        if (fadeIn) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    };

    return {
        in: () => fadeImpl(true),
        out: () => fadeImpl(false),
    };
}

export enum SlideDirection {
    InFromTop = "inFromTop",
    OutToTop = "outToTop",
    InFromBottom = "inFromBottom",
    OutToBottom = "outToBottom",
    InFromLeft = "inFromLeft",
    OutToLeft = "outToLeft",
    InFromRight = "inFromRight",
    OutToRight = "outToRight",
}

export type SlideAnimation = Record<SlideDirection, () => void>;

export function slide(
    element: HTMLElement,
    duration: number = 300,
    y: number = 50,
    delay: number = 0,
    onFinish?: () => void,
): SlideAnimation {
    const slideImpl = (direction: SlideDirection): void => {
        const behaviour: Record<
            SlideDirection,
            {
                instructions: Keyframe[];
                applyStyles: () => void;
            }
        > = {
            [SlideDirection.InFromTop]: {
                instructions: [
                    {
                        transform: `translateY(-${y}px)`,
                        opacity: 0,
                    },
                    {
                        transform: "translateY(0)",
                        opacity: 1,
                    },
                ],
                applyStyles: () => {
                    element.style.transform = "translateY(0)";
                    element.style.opacity = "1";
                    element.style.display = "block";
                },
            },
            [SlideDirection.OutToTop]: {
                instructions: [
                    {
                        transform: "translateY(0)",
                        opacity: 1,
                    },
                    {
                        transform: `translateY(-${y}px)`,
                        opacity: 0,
                    },
                ],
                applyStyles: () => {
                    element.style.transform = `translateY(-${y}px)`;
                    element.style.opacity = "0";
                    element.style.display = "none";
                },
            },
            [SlideDirection.InFromBottom]: {
                instructions: [
                    {
                        transform: `translateY(${y}px)`,
                        opacity: 0,
                    },
                    {
                        transform: "translateY(0)",
                        opacity: 1,
                    },
                ],
                applyStyles: () => {
                    element.style.transform = "translateY(0)";
                    element.style.opacity = "1";
                    element.style.display = "block";
                },
            },
            [SlideDirection.OutToBottom]: {
                instructions: [
                    {
                        transform: "translateY(0)",
                        opacity: 1,
                    },
                    {
                        transform: `translateY(${y}px)`,
                        opacity: 0,
                    },
                ],
                applyStyles: () => {
                    element.style.transform = `translateY(${y}px)`;
                    element.style.opacity = "0";
                    element.style.display = "none";
                },
            },
            [SlideDirection.InFromLeft]: {
                instructions: [
                    {
                        transform: `translateX(-${y}px)`,
                        opacity: 0,
                    },
                    {
                        transform: "translateX(0)",
                        opacity: 1,
                    },
                ],
                applyStyles: () => {
                    element.style.transform = "translateX(0)";
                    element.style.opacity = "1";
                    element.style.display = "block";
                },
            },
            [SlideDirection.OutToLeft]: {
                instructions: [
                    {
                        transform: "translateX(0)",
                        opacity: 1,
                    },
                    {
                        transform: `translateX(-${y}px)`,
                        opacity: 0,
                    },
                ],
                applyStyles: () => {
                    element.style.transform = `translateX(-${y}px)`;
                    element.style.opacity = "0";
                    element.style.display = "none";
                },
            },
        };

        if (!behaviour[direction as SlideDirection]) {
            throw new Error(`Unknown slide direction: ${direction}`);
        }

        const { instructions, applyStyles } =
            behaviour[direction as SlideDirection];

        element.animate(instructions, {
            duration,
            easing: "ease-in-out",
            fill: "forwards",
            delay,
        }).onfinish = () => {
            applyStyles();
            onFinish?.();
        };
    };

    return {
        [SlideDirection.InFromTop]: () => slideImpl(SlideDirection.InFromTop),
        [SlideDirection.OutToTop]: () => slideImpl(SlideDirection.OutToTop),
        [SlideDirection.InFromBottom]: () =>
            slideImpl(SlideDirection.InFromBottom),
        [SlideDirection.OutToBottom]: () =>
            slideImpl(SlideDirection.OutToBottom),
        [SlideDirection.InFromLeft]: () => slideImpl(SlideDirection.InFromLeft),
        [SlideDirection.OutToLeft]: () => slideImpl(SlideDirection.OutToLeft),
        [SlideDirection.InFromRight]: () =>
            slideImpl(SlideDirection.InFromRight),
        [SlideDirection.OutToRight]: () => slideImpl(SlideDirection.OutToRight),
    };
}
