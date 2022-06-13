var isZeroOrOne = function (val) { return (val === 0 || val === 1); };
export var easingFunctions = {
    linear: function (val) { return (val); },
    easeInSine: function (val) { return (1 - Math.cos((val * Math.PI) / 2)); },
    easeOutSine: function (val) { return (Math.sin((val * Math.PI) / 2)); },
    easeInOutSine: function (val) { return ((1 - Math.cos(Math.PI * val)) / 2); },
    easeInQuad: function (val) { return (val * val); },
    easeOutQuad: function (val) { return (1 - (1 - val) * (1 - val)); },
    easeInOutQuad: function (val) { return (val < 0.5
        ? 2 * val * val
        : 1 - 2 * (1 - val) * (1 - val)); },
    easeInCubic: function (val) { return (val * val * val); },
    easeOutCubic: function (val) { return (1 - (1 - val) * (1 - val) * (1 - val)); },
    easeInOutCubic: function (val) { return (val < 0.5
        ? 4 * val * val * val
        : 1 - 4 * (1 - val) * (1 - val) * (1 - val)); },
    easeInQuart: function (val) { return (val * val * val * val); },
    easeOutQuart: function (val) { return (1 - (1 - val) * (1 - val) * (1 - val) * (1 - val)); },
    easeInOutQuart: function (val) { return (val < 0.5
        ? 8 * val * val * val * val
        : 1 - 8 * (1 - val) * (1 - val) * (1 - val) * (1 - val)); },
    easeInQuint: function (val) { return (val * val * val * val * val); },
    easeOutQuint: function (val) { return (1 - (1 - val) * (1 - val) * (1 - val) * (1 - val) * (1 - val)); },
    easeInOutQuint: function (val) { return (val < 0.5
        ? 16 * val * val * val * val * val
        : 1 - 16 * (1 - val) * (1 - val) * (1 - val) * (1 - val) * (1 - val)); },
    easeInExpo: function (val) { return (isZeroOrOne(val)
        ? val
        : Math.pow(2, 10 * val - 10)); },
    easeOutExpo: function (val) { return (isZeroOrOne(val)
        ? val
        : 1 - Math.pow(2, -10 * val)); },
    easeInOutExpo: function (val) { return (val < 0.5
        ? easingFunctions.easeInExpo(2 * val) / 2
        : (2 - Math.pow(2, 10 - 20 * val)) / 2); },
    easeInCirc: function (val) { return (1 - Math.sqrt(1 - val * val)); },
    easeOutCirc: function (val) { return (Math.sqrt(1 - (val - 1) * (val - 1))); },
    easeInOutCirc: function (val) { return (val < 0.5
        ? (1 - Math.sqrt(1 - 4 * val * val)) / 2
        : (1 + Math.sqrt(1 - 4 * (1 - val) * (1 - val))) / 2); },
    easeInBack: function (val) { return (2.70158 * val * val * val - 1.70158 * val * val); },
    easeOutBack: function (val) { return (1 + 2.70158 * (val - 1) * (val - 1) * (val - 1) + 1.70158 * (val - 1) * (val - 1)); },
    easeInOutBack: function (val) { return (val < 0.5
        ? 2 * val * val * (3.595 * 2 * val - 2.595)
        : 2 * (val - 1) * (val - 1) * (3.595 * (val * 2 - 2) + 2.595) + 1); },
    easeInElastic: function (val) { return (isZeroOrOne(val)
        ? val
        : -Math.pow(2, 10 * val - 10) * Math.sin((10 * val - 10.75) * 2 * Math.PI / 3)); },
    easeOutElastic: function (val) { return (isZeroOrOne(val)
        ? val
        : 1 + Math.pow(2, -10 * val) * Math.sin((10 * val - 0.75) * 2 * Math.PI / 3)); },
    easeInOutElastic: function (val) {
        if (isZeroOrOne(val))
            return val;
        return val < 0.5
            ? -Math.pow(2, 20 * val - 10) * Math.sin((20 * val - 11.125) * 2 * Math.PI / 4.5) / 2
            : 1 + Math.pow(2, 10 - 20 * val) * Math.sin((20 * val - 11.125) * 2 * Math.PI / 4.5) / 2;
    },
    easeInBounce: function (val) { return (1 - easingFunctions.easeOutBounce(1 - val)); },
    easeOutBounce: function (val) {
        var n = 7.5625, d = 2.75;
        if (val < 1 / d)
            return n * val * val;
        if (val < 2 / d)
            return 0.75 + n * (val - 1.5 / d) * (val - 1.5 / d);
        if (val < 2.5 / d)
            return 0.9375 + n * (val - 2.25 / d) * (val - 2.25 / d);
        return 0.984375 + n * (val - 2.625 / d) * (val - 2.625 / d);
    },
    easeInOutBounce: function (val) { return val < 0.5 ?
        (1 - easingFunctions.easeOutBounce(1 - 2 * val)) / 2 :
        (1 + easingFunctions.easeOutBounce(2 * val - 1)) / 2; }
};
export default easingFunctions;
