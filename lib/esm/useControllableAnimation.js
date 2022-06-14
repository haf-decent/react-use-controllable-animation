import { useCallback, useEffect, useRef } from "react";
import easingFunctions from "./easings";
function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
}
export default function useControllableAnimation(_a) {
    var _b = _a.autoplay, autoplay = _b === void 0 ? true : _b, _c = _a.duration, duration = _c === void 0 ? 1000 : _c, _d = _a.delay, delay = _d === void 0 ? 0 : _d, _e = _a.alternateDelay, alternateDelay = _e === void 0 ? false : _e, _f = _a.loops, loops = _f === void 0 ? Infinity : _f, _g = _a.alternate, alternate = _g === void 0 ? false : _g, _h = _a.easing, easing = _h === void 0 ? "linear" : _h, onProgress = _a.onProgress, _j = _a.onLoop, onLoop = _j === void 0 ? undefined : _j, _k = _a.onFinish, onFinish = _k === void 0 ? undefined : _k;
    var startTime = useRef();
    var progress = useRef(0);
    var progressWithDelay = useRef(0);
    var active = useRef(false);
    var loop = useRef(0);
    var propsRef = useRef({
        duration: duration,
        delay: delay,
        alternateDelay: alternateDelay,
        loops: loops,
        alternate: alternate,
        easingFunction: typeof easing === "string"
            ? easingFunctions[easing]
            : easing,
        onProgress: onProgress,
        onLoop: onLoop,
        onFinish: onFinish
    });
    Object.assign(propsRef.current, {
        duration: duration,
        delay: delay,
        alternateDelay: alternateDelay,
        loops: loops,
        alternate: alternate,
        easingFunction: typeof easing === "string"
            ? easingFunctions[easing]
            : easing,
        onProgress: onProgress,
        onLoop: onLoop,
        onFinish: onFinish
    });
    var loopCallback = useCallback(function (timestamp) {
        if (!active.current)
            return;
        requestAnimationFrame(loopCallback);
        var current = propsRef.current;
        var shouldAlternate = current.alternate && loop.current % 2;
        var loopDuration = current.duration + (!current.alternateDelay || !shouldAlternate
            ? current.delay
            : 0);
        if (!startTime.current) {
            startTime.current = timestamp - progressWithDelay.current * loopDuration;
        }
        progressWithDelay.current = clamp((timestamp - startTime.current) / loopDuration, 0, 1);
        progress.current = clamp((timestamp - startTime.current - (loopDuration - current.duration)) / current.duration, 0, 1);
        var p = current.easingFunction(shouldAlternate
            ? 1 - progress.current
            : progress.current);
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
    var start = useCallback(function () {
        if (active.current)
            return;
        active.current = true;
        requestAnimationFrame(loopCallback);
    }, [loopCallback]);
    var pause = useCallback(function () {
        active.current = false;
        startTime.current = undefined;
    }, []);
    var reset = useCallback(function () {
        startTime.current = undefined;
        progress.current = 0;
        progressWithDelay.current = 0;
        loop.current = 0;
        onProgress(0, {
            uneasedProgress: 0,
            progressWithDelay: 0,
            loop: 0
        });
    }, [onProgress]);
    var stop = useCallback(function () {
        active.current = false;
        reset();
    }, [reset]);
    useEffect(function () {
        if (autoplay)
            start();
    }, [autoplay, start]);
    return {
        start: start,
        pause: pause,
        reset: reset,
        stop: stop
    };
}
