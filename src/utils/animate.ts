export const beziers = {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    linear: "linear",
    easeInBack: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
    easeOutBack: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    easeInOutBack: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    easeInCirc: "cubic-bezier(0.6, 0.045, 0.98, 0.335)",
    easeOutCirc: "cubic-bezier(0.075, 0.82, 0.165, 1)",
    easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
    easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
    easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
    easeInOutExpo: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
    easeInQuart: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
    easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
    easeInSine: "cubic-bezier(0.47, 0, 0.745, 0.715)",
    easeOutSine: "cubic-bezier(0.39, 0.575, 0.565, 1)",
    easeInOutSine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
    easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
};

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

const createDirs = (element: HTMLElement, y: number) => ({
    inFromTop: () => ({
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
    }),
    outToTop: () => {
        return {
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
        };
    },
    inFromBottom: () => ({
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
    }),
    outToBottom: () => ({
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
    }),
    inFromLeft: () => ({
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
    }),
    outToLeft: () => ({
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
    }),
    inFromRight: () => ({
        instructions: [
            {
                transform: `translateX(${y}px)`,
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
    }),
    outToRight: () => ({
        instructions: [
            {
                transform: "translateX(0)",
                opacity: 1,
            },
            {
                transform: `translateX(${y}px)`,
                opacity: 0,
            },
        ],
        applyStyles: () => {
            element.style.transform = `translateX(${y}px)`;
            element.style.opacity = "0";
            element.style.display = "none";
        },
    }),
});

export function slide(
    element: HTMLElement,
    effectTiming: EffectTiming = {
        duration: 300,
        delay: 0,
        easing: "ease-in-out",
    },
    y: number = 50,
    onFinish?: () => void,
): SlideAnimation {
    const slideImpl = (direction: SlideDirection): void => {
        const behaviour = createDirs(element, y);

        if (!behaviour[direction]) {
            throw new Error(`Unknown slide direction: ${direction}`);
        }

        const { instructions, applyStyles } = behaviour[direction]();

        element.animate(instructions, effectTiming).onfinish = () => {
            applyStyles();

            if (direction.startsWith("out")) {
                element.style.display = "none";
            } else {
                element.style.display = "block";
            }

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
