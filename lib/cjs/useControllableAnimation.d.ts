import easingFunctions from "./easings";
export default function useControllableAnimation({ autoplay, duration, delay, alternateDelay, loops, alternate, easing, onProgress, onLoop, onFinish }: {
    autoplay?: boolean;
    duration?: number;
    delay?: number;
    alternateDelay?: boolean;
    loops?: number;
    alternate?: boolean;
    easing?: (keyof typeof easingFunctions | ((val: number) => number));
    onProgress: (progress: number, { uneasedProgress, progressWithDelay, loop }: {
        uneasedProgress: number;
        progressWithDelay: number;
        loop: number;
    }) => void;
    onLoop?: (loop: number) => void;
    onFinish?: () => void;
}): {
    start: () => void;
    pause: () => void;
    reset: () => void;
    stop: () => void;
};
