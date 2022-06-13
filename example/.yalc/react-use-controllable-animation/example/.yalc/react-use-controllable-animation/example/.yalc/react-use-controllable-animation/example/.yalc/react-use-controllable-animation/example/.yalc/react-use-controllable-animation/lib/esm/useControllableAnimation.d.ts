import easingFunctions from "./easings";
export default function useControllableAnimation({ autoplay, duration, loops, alternate, easing, onProgress, onLoop, onFinish }: {
    autoplay?: boolean;
    duration?: number;
    loops?: number;
    alternate?: boolean;
    easing?: (keyof typeof easingFunctions | ((val: number) => number));
    onProgress: (progress: number, rawProgress: number, loop: number) => void;
    onLoop?: (loop: number) => void;
    onFinish?: () => void;
}): {
    start: () => void;
    pause: () => void;
    reset: () => void;
    stop: () => void;
};
