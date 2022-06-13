import { useCallback, useEffect, useRef } from "react";
import easingFunctions from "./easings";
export default function useControllableAnimation(_a) {
    var _b = _a.autoplay, autoplay = _b === void 0 ? true : _b, _c = _a.duration, duration = _c === void 0 ? 1000 : _c, _d = _a.loops, loops = _d === void 0 ? Infinity : _d, _e = _a.alternate, alternate = _e === void 0 ? false : _e, _f = _a.easing, easing = _f === void 0 ? "linear" : _f, onProgress = _a.onProgress, _g = _a.onLoop, onLoop = _g === void 0 ? undefined : _g, _h = _a.onFinish, onFinish = _h === void 0 ? undefined : _h;
    var startTime = useRef();
    var progress = useRef(0);
    var active = useRef(autoplay);
    var loop = useRef(0);
    var propsRef = useRef({
        duration: duration,
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
        if (!startTime.current) {
            startTime.current = timestamp - progress.current * current.duration;
        }
        progress.current = (timestamp - startTime.current) / current.duration;
        var p = current.easingFunction(current.alternate && loop.current % 2
            ? Math.max(0, 1 - progress.current)
            : Math.min(1, progress.current));
        current.onProgress(p, progress.current, loop.current);
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
        loop.current = 0;
    }, []);
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
