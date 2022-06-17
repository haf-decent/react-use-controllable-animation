const isZeroOrOne = (val: number) => (val === 0 || val === 1);

export const easingFunctions = {
	linear: (val: number) => (
		val
	),
	easeInSine: (val: number) => (
		1 - Math.cos((val * Math.PI) / 2)
	),
	easeOutSine: (val: number) => (
		Math.sin((val * Math.PI) / 2)
	),
	easeInOutSine: (val: number) => (
		(1 - Math.cos(Math.PI * val)) / 2
	),
	easeInQuad: (val: number) => (
		val * val
	),
	easeOutQuad: (val: number) => (
		1 - (1 - val) * (1 - val)
	),
	easeInOutQuad: (val: number) => (
		val < 0.5
			? 2 * val * val
			: 1 - 2 * (1 - val) * (1 - val)
	),
	easeInCubic: (val: number) => (
		val * val * val
	),
	easeOutCubic: (val: number) => (
		1 - (1 - val) * (1 - val) * (1 - val)
	),
	easeInOutCubic: (val: number) => (
		val < 0.5
			? 4 * val * val * val
			: 1 - 4 * (1 - val) * (1 - val) * (1 - val)
	),
	easeInQuart: (val: number) => (
		val * val * val * val
	),
	easeOutQuart: (val: number) => (
		1 - (1 - val) * (1 - val) * (1 - val) * (1 - val)
	),
	easeInOutQuart: (val: number) => (
		val < 0.5
			? 8 * val * val * val * val
			: 1 - 8 * (1 - val) * (1 - val) * (1 - val) * (1 - val)
	),
	easeInQuint: (val: number) => (
		val * val * val * val * val
	),
	easeOutQuint: (val: number) => (
		1 - (1 - val) * (1 - val) * (1 - val) * (1 - val) * (1 - val)
	),
	easeInOutQuint: (val: number) => (
		val < 0.5
			? 16 * val * val * val * val * val
			: 1 - 16 * (1 - val) * (1 - val) * (1 - val) * (1 - val) * (1 - val)
	),
	easeInExpo: (val: number) => (
		isZeroOrOne(val)
			? val
			: Math.pow(2, 10 * val - 10)
	),
	easeOutExpo: (val: number) => (
		isZeroOrOne(val)
			? val
			: 1 - Math.pow(2, -10 * val)
	),
	easeInOutExpo: (val: number) => (
		val < 0.5
			? easingFunctions.easeInExpo(2 * val) / 2
			: (2 - Math.pow(2, 10 - 20 * val)) / 2
	),
	easeInCirc: (val: number) => (
		1 - Math.sqrt(1 - val * val)
	),
	easeOutCirc: (val: number) => (
		Math.sqrt(1 - (val - 1) * (val - 1))
	),
	easeInOutCirc: (val: number) => (
		val < 0.5
			? (1 - Math.sqrt(1 - 4 * val * val)) / 2
			: (1 + Math.sqrt(1 - 4 * (1 - val) * (1 - val))) / 2
	),
	easeInBack: (val: number) => (
		2.70158 * val * val * val - 1.70158 * val * val
	),
	easeOutBack: (val: number) => (
		1 + 2.70158 * (val - 1) * (val - 1) * (val - 1) + 1.70158 * (val - 1) * (val - 1)
	),
	easeInOutBack: (val: number) => (
		val < 0.5
			? 2 * val * val * (3.595 * 2 * val - 2.595)
			: 2 * (val - 1) * (val - 1) * (3.595 * (val * 2 - 2) + 2.595) + 1
	),
	easeInElastic: (val: number) => (
		isZeroOrOne(val)
			? val
			: -Math.pow(2, 10 * val - 10) * Math.sin((10 * val - 10.75) * 2 * Math.PI / 3)
	),
	easeOutElastic: (val: number) => (
		isZeroOrOne(val)
			? val
			: 1 + Math.pow(2, -10 * val) * Math.sin((10 * val - 0.75) * 2 * Math.PI / 3)
	),
	easeInOutElastic: (val: number) => {
		if (isZeroOrOne(val)) return val;

		return val < 0.5
			? -Math.pow(2, 20 * val - 10) * Math.sin((20 * val - 11.125) * 2 * Math.PI / 4.5) / 2
			: 1 + Math.pow(2, 10 - 20 * val) * Math.sin((20 * val - 11.125) * 2 * Math.PI / 4.5) / 2
	},
	easeInBounce: (val: number) => (
		1 - easingFunctions.easeOutBounce(1 - val)
	),
	easeOutBounce: (val: number) => {
		const n = 7.5625, d = 2.75;
		if (val < 1 / d) return n * val * val;
		if (val < 2 / d) return 0.75 + n * (val - 1.5 / d) * (val - 1.5 / d);
		if (val < 2.5 / d) return 0.9375 + n * (val - 2.25 / d) * (val - 2.25 / d);
	
		return 0.984375 + n * (val - 2.625 / d) * (val - 2.625 / d);
	},
	easeInOutBounce: (val: number) => (
		val < 0.5
			? (1 - easingFunctions.easeOutBounce(1 - 2 * val)) / 2
			: (1 + easingFunctions.easeOutBounce(2 * val - 1)) / 2
	)
}

export default easingFunctions