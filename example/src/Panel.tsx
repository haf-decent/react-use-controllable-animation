import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useControllableAnimation, { easingFunctions } from "react-use-controllable-animation";

import playIcon from "./play.svg";
import pauseIcon from "./pause.svg";
import skipIcon from "./skip.svg";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: stretch;
	align-items: center;
	border: 1px solid black;
	width: 100%;
	max-width: 400px;
	margin: 20px;
`;

const Title = styled.div`
	width: 100%;
	padding: 15px;
	font-weight: 700;
	color: black;
	border-bottom: 1px solid black;
`;

const Body = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 100%;
	aspect-ratio: 1;
	padding: 60px;
	overflow: hidden;
`;
const Canvas = styled.canvas`
	position: absolute;
`;
const DotContainer = styled.div`
	position: absolute;
	width: calc(100% - 120px);
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
`;
const DotPos = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	position: absolute;
	right: 60px;
	bottom: 60px;
	width: 100px;
	border: 1px solid black;
	padding: 6px 10px;
	font-size: 9px;
`;

const Footer = styled.div`
	width: 100%;
	height: 60px;
	padding: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid black;
`;

const Controls = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;
const Button = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 40px;
	height: 40px;
	border-radius: 5px;
	padding: 10px;
	color: black;
	outline: none;
	border: 1px solid rgba(0,0,0,0.4);
	background-color: white;

	& > img {
		max-width: 20px;
		max-height: 20px;
	}
	& > div {
		width: 16px;
		height: 16px;
		margin: 2px;
		background-color: black;
	}
	&:not(:first-of-type) {
		margin-left: 10px;
	}

	cursor: pointer;
`;

const ptsArr = Array.from({ length: 99 }, (_, i) => (i + 1) / 100);
const margin = 60;

export default function Panel({
	easing,
	duration
}: {
	easing: keyof typeof easingFunctions,
	duration: number
}) {
	const dot = useRef<HTMLDivElement | null>(null);
	const pos = useRef<HTMLDivElement | null>(null);

	const [ canvasRef, setCanvasRef ] = useState<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (!canvasRef) return;

		let { width, height } = canvasRef;
		width -= 2 * margin;
		height -= 2 * margin;
		const ctx = canvasRef.getContext("2d");
		ctx?.clearRect(0, 0, width, height);
		ctx?.beginPath();
		ctx?.moveTo(margin, height + margin);
		for (let x of ptsArr) {
			ctx?.lineTo(margin + width * x, margin + height * (1 - easingFunctions[ easing ](x)))
		}
		ctx?.moveTo(margin + width, margin);
		ctx?.stroke();
	}, [ canvasRef, easing ]);

	const [ isPlaying, setIsPlaying ] = useState(true);
	const [ loops, setLoops ] = useState(0);

	const { start, pause, reset, stop } = useControllableAnimation({
		autoplay: false,
		easing,
		duration,
		onProgress: (progress: number, rawProgress: number) => {
			if (!dot.current) return;

			const x = Math.round(280 * rawProgress);
			const y = Math.round(280 * progress);
			dot.current.style.left = `${x}px`;
			dot.current.style.bottom = `${y}px`;
			
			if (!pos.current) return;
			pos.current.children[0].textContent = `x: ${x}px (${rawProgress.toFixed(3)})`;
			pos.current.children[1].textContent = `y: ${y}px (${progress.toFixed(3)})`;
		},
		onLoop: (loop: number) => setLoops(loop)
	});

	useEffect(() => {
		isPlaying
			? start()
			: pause();
	}, [ isPlaying, start, pause ]);

	return (
		<Container>
			<Title>{easing}</Title>
			<Body>
				<DotContainer>
					<Dot ref={dot}/>
				</DotContainer>
				<DotPos ref={pos}>
					<div></div>
					<div></div>
				</DotPos>
				<Canvas ref={setCanvasRef} width={400} height={400}/>
			</Body>
			<Footer>
				<div>Loops: {loops}</div>
				<Controls>
					<Button onClick={() => setIsPlaying(p => !p)}>
						<img src={isPlaying ? pauseIcon: playIcon} alt=">"/>
					</Button>
					<Button
						onClick={() => {
							reset();
							setLoops(0);
						}}>
						<img src={skipIcon} alt="|>" style={{ transform: `scaleX(-1)` }}/>
					</Button>
					<Button
						onClick={() => {
							stop();
							setIsPlaying(false);
							setLoops(0);
						}}>
						<div></div>
					</Button>
				</Controls>
			</Footer>
		</Container>
	)
}