import { useEffect, useState } from "react";

export default function useScreenBreakpoint(widths: number[]) {
	const [ widthIndex, setWidthIndex ] = useState(0);

	useEffect(() => {
		const onResize = () => {
			const { innerWidth: w } = window;
			for (let i = 0; i <= widths.length; i++) {
				if (w > (widths[ i - 1 ] || 0) && w <= (widths[i] || Infinity)) {
					setWidthIndex(i);
					break;
				}
			}
		}
		onResize();
		window.addEventListener("resize", onResize);

		return () => window.removeEventListener("resize", onResize);
	}, []);

	return widthIndex;
}