import { useEffect, useState } from "react";
import styled from "styled-components";
import { easingFunctions } from "react-use-controllable-animation";

const Container = styled.div<{ width: number }>`
	display: flex;
	flex-direction: column;
	justify-content: stretch;
	align-items: center;
	width: ${({ width }) => width}px;
	margin: 20px;
	border-radius: 20px;
	box-shadow: inset 0 7px 17px rgba(0,0,0,0.2);
	@media (prefers-color-scheme: dark) {
		background-color: #141414;
		box-shadow: none;
		border: 1px solid rgba(255,255,255,0.5);
		color: white;
	}
`;

const Title = styled.div`
	width: 100%;
	padding: 20px 25px;
	font-weight: 700;
	border-bottom: 1px solid rgba(0,0,0,0.5);
	@media (prefers-color-scheme: dark) {
		border-color: rgba(255,255,255,0.5);
	}
`;

const Body = styled.div<{ padding: number }>`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 100%;
	aspect-ratio: 1;
	padding: ${({ padding }) => padding}px;
	overflow: hidden;
`;
const Canvas = styled.canvas`
	position: absolute;
	@media (prefers-color-scheme: dark) {
		filter: invert();
	}
`;
const DotContainer = styled.div<{ margin: number }>`
	position: absolute;
	width: calc(100% - ${({ margin }) => 2 * margin}px);
	aspect-ratio: 1;
`;
const Dot = styled.div`
	position: absolute;
	left: 0%;
	bottom: 0%;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: black;
	transform: translate(-10px, 10px);
	@media (prefers-color-scheme: dark) {
		background-color: white;
	}
`;
const DotPos = styled.div<{ alignLeft: boolean, margin: number }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	position: absolute;
	${({ alignLeft, margin }) => alignLeft
		? `
			left: ${margin}px;
			top: ${margin}px;
		`
		: `
			right: ${margin}px;
			bottom: ${margin}px;
		`
	}
	width: 110px;
	border: 1px solid black;
	padding: 6px 10px;
	font-size: 9px;
	font-weight: 700;
	@media (prefers-color-scheme: dark) {
		border-color: white;
	}
`;

const ptsArr = Array.from({ length: 99 }, (_, i) => (i + 1) / 100);

export default function AnimationPanel({
	easing,
	register,
	width = 400,
	margin = 60
}: {
	easing: keyof typeof easingFunctions,
	register: (panel: object) => void,
	width?: number,
	margin?: number
}) {
	const [ dot, setDot ] = useState<HTMLDivElement | null>(null);
	const [ pos, setPos ] = useState<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!dot || !pos) return;

		register({ dot, pos });
	}, [ dot, pos, register ]);

	const [ canvasRef, setCanvasRef ] = useState<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (!canvasRef) return;

		const cWidth = width - 2 * margin;
		const ctx = canvasRef.getContext("2d");
		ctx?.clearRect(0, 0, cWidth, cWidth);
		ctx?.beginPath();
		ctx?.moveTo(margin, cWidth + margin);
		for (let x of ptsArr) {
			ctx?.lineTo(margin + cWidth * x, margin + cWidth * (1 - easingFunctions[ easing ](x)))
		}
		ctx?.moveTo(margin + cWidth, margin);
		ctx?.stroke();

		return () => ctx?.clearRect(0, 0, canvasRef.width, canvasRef.height);
	}, [ canvasRef, easing, width, margin ]);

	return (
		<Container width={width}>
			<Title>{easing}</Title>
			<Body padding={margin}>
				<DotContainer margin={margin}>
					<Dot ref={setDot}/>
				</DotContainer>
				<DotPos
					ref={setPos}
					alignLeft={(/easeIn(?!Out)/i).test(easing)}
					margin={margin}>
					<div></div>
					<div></div>
				</DotPos>
				<Canvas ref={setCanvasRef} width={width} height={width}/>
			</Body>
		</Container>
	)
}