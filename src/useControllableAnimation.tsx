import { useCallback, useEffect, useRef } from "react";

import easingFunctions from "./easings";

function clamp(val: number, min: number, max: number) {
	return Math.max(min, Math.min(val, max));
}

export default function useControllableAnimation({
	autoplay = true,
	duration = 1000,
	delay = 0,
	alternateDelay = false,
	loops = Infinity,
	alternate = false,
	easing = "linear",
	onProgress,
	onLoop = undefined,
	onFinish = undefined
}: {
	autoplay?: boolean,
	duration?: number,
	delay?: number,
	alternateDelay?: boolean,
	loops?: number,
	alternate?: boolean,
	easing?: (keyof typeof easingFunctions | ((val: number) => number)),
	onProgress: (
		progress: number,
		{
			uneasedProgress,
			progressWithDelay,
			loop
		}: {
			uneasedProgress: number,
			progressWithDelay: number
			loop: number
		}) => void,
	onLoop?: (loop: number) => void,
	onFinish?: () => void
}) {
	const startTime = useRef<undefined | number>();
	const progress = useRef(0);
	const progressWithDelay = useRef(0);
	const active = useRef(false);
	const loop = useRef(0);

	const propsRef = useRef({
		duration,
		delay,
		alternateDelay,
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
		delay,
		alternateDelay,
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
		const shouldAlternate = current.alternate && loop.current % 2;
		const loopDuration = current.duration + (
			!current.alternateDelay || !shouldAlternate
				? current.delay
				: 0
		)
		if (!startTime.current) {
			startTime.current = timestamp - progressWithDelay.current * loopDuration;
		}
		progressWithDelay.current = clamp((timestamp - startTime.current) / loopDuration, 0, 1);
		progress.current = clamp((timestamp - startTime.current - (loopDuration - current.duration)) / current.duration, 0, 1);
		const p = current.easingFunction(
			shouldAlternate
				? 1 - progress.current
				: progress.current
		);

		current.onProgress(p, {
			uneasedProgress: progress.current,
			progressWithDelay: progressWithDelay.current,
			loop: loop.current
		});
		
		if (progress.current === 1) {
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
		progressWithDelay.current = 0;
		loop.current = 0;
		onProgress(0, {
			uneasedProgress: 0,
			progressWithDelay: 0,
			loop: 0
		});
	}, [ onProgress ]);

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