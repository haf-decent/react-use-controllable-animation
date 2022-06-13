import { useCallback, useEffect, useRef } from "react";

import easingFunctions from "./easings";

export default function useControllableAnimation({
	autoplay = true,
	duration = 1000,
	loops = Infinity,
	alternate = false,
	easing = "linear",
	onProgress,
	onLoop = undefined,
	onFinish = undefined
}: {
	autoplay?: boolean,
	duration?: number,
	loops?: number,
	alternate?: boolean,
	easing?: (keyof typeof easingFunctions | ((val: number) => number)),
	onProgress: (progress: number, rawProgress: number, loop: number) => void,
	onLoop?: (loop: number) => void,
	onFinish?: () => void
}) {
	const startTime = useRef<undefined | number>();
	const progress = useRef(0);
	const active = useRef(autoplay);
	const loop = useRef(0);

	const propsRef = useRef({
		duration,
		loops,
		alternate,
		easingFunction: typeof easing === "string"
			? easingFunctions[ easing ]
			: easing,
		onProgress,
		onLoop,
		onFinish
	});

	Object.assign(propsRef.current, {
		duration,
		loops,
		alternate,
		easingFunction: typeof easing === "string"
			? easingFunctions[ easing ]
			: easing,
		onProgress,
		onLoop,
		onFinish
	});

	const loopCallback = useCallback((timestamp: number) => {
		if (!active.current) return;

		requestAnimationFrame(loopCallback);

		const { current } = propsRef;
		if (!startTime.current) {
			startTime.current = timestamp - progress.current * current.duration;
		}
		progress.current = Math.max(0, Math.max((timestamp - startTime.current) / current.duration, 1));
		const p = current.easingFunction(
			current.alternate && loop.current % 2
				? 1 - progress.current
				: progress.current
		);

		current.onProgress(p, progress.current, loop.current);
		
		if (progress.current === 1) {
			console.log()
			if (++loop.current < current.loops) {
				startTime.current = timestamp;
				current.onLoop && current.onLoop(loop.current);
			}
			else {
				active.current = false;
				loop.current = 0;
				startTime.current = undefined;
				current.onFinish && current.onFinish();
			}
		}
	}, []);

	const start = useCallback(() => {
		if (active.current) return;
		active.current = true;
		requestAnimationFrame(loopCallback);
	}, [ loopCallback ]);

	const pause = useCallback(() => {
		active.current = false;
		startTime.current = undefined;
	}, []);

	const reset = useCallback(() => {
		startTime.current = undefined;
		progress.current = 0;
		loop.current = 0;
	}, []);

	const stop = useCallback(() => {
		active.current = false;
		reset();
	}, [ reset ]);

	useEffect(() => {
		if (autoplay) start();
	}, [ autoplay, start ]);

	return {
		start,
		pause,
		reset,
		stop
	}
}