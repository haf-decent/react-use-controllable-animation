import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useControllableAnimation, { easingFunctions } from "react-use-controllable-animation";

import playIcon from "./play.svg";
import pauseIcon from "./pause.svg";
import skipIcon from "./skip.svg";

import AnimationPanel from "./AnimationPanel";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	max-width: 1200px;
	padding: 100px 30px;
	@media only screen and (min-width: 740px) {
		& > div:first-of-type {
			margin-left: 25%;
			margin-right: 25%;
		}
	}
`;

const Header = styled.div`
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 80px;
	padding: 20px;
	font-size: 24px;
	font-weight: 700;
	background-color: white;
	box-shadow: 0 7px 17px rgba(0,0,0,0.2);
	@media (prefers-color-scheme: dark) {
		background-color: #202020;
		color: white;
		box-shadow: 0 7px 17px rgba(0,0,0,0.4);
	}
`;

const Footer = styled.div`
	position: fixed;
	bottom: 0px;
	left: 0px;
	right: 0px;
	height: 80px;
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	box-shadow: 0 7px 17px rgba(0,0,0,0.4);
	@media (prefers-color-scheme: dark) {
		background-color: #202020;
		color: white;
		box-shadow: 0 7px 17px rgba(0,0,0,0.8);
	}
`;
const FooterSection = styled.div`
	width: 33%;
	display: flex;
	justify-content: center;
	align-items: center;

	& input {
		max-width: 60px;
		outline: none;
		border: none;
	}
	& > *:not(:first-of-type) {
		margin-left: 15px;
	}

	@media (prefers-color-scheme: dark) {
		& input {
			background-color: #141414;
			color: white;
			border: 1px solid rgba(255,255,255,0.5);
			&[type="checkbox"] {
				filter: grayscale(1);
			}
		}
	}
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

	@media (prefers-color-scheme: dark) {
		background-color: #181818;
		color: white;
		border-color: rgba(255,255,255,0.5);
		& > img {
			filter: invert();
		}
		& > div {
			background-color: white;
		}
	}

	cursor: pointer;
`;

type panel = {
	dot: HTMLDivElement,
	pos: HTMLDivElement,
	easing: keyof typeof easingFunctions
}

const panelWidth = 300;
const panelMargin = 40;

function App() {
	const panels = useRef(new Array(Object.keys(easingFunctions).length));

	const [ isPlaying, setIsPlaying ] = useState(true);
	const [ loops, setLoops ] = useState(0);

	const [ duration, setDuration ] = useState(4000);
	const [ alternate, setAlternate ] = useState(false);
	const altRef = useRef(false);
	altRef.current = alternate;

	const { start, pause, reset, stop } = useControllableAnimation({
		duration,
		alternate,
		onProgress: (progress: number, rawProgress: number, loop: number) => {
			const rawX = altRef.current && loop % 2
				? 1 - rawProgress
				: rawProgress;
			
			panels.current.forEach((panel: (panel | undefined)) => {
				if (!panel) return;
				const { dot, pos, easing } = panel;

				const easedProgress = easingFunctions[ easing ](progress);
				const x = Math.round((panelWidth - 2 * panelMargin) * rawX);
				const y = Math.round((panelWidth - 2 * panelMargin) * easedProgress);
				dot.style.left = `${x}px`;
				dot.style.bottom = `${y}px`;

				pos.children[0].textContent = `x: ${x}px (${rawProgress.toFixed(3)})`;
				pos.children[1].textContent = `y: ${y}px (${progress.toFixed(3)})`;
			})
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
			{Object.keys(easingFunctions).map((name, i) => (
				<AnimationPanel
					key={name}
					width={panelWidth}
					margin={panelMargin}
					register={(panel: object) => {
						panels.current[ i ] = {
							...panel,
							easing: name
						}
					}}
					easing={name as keyof typeof easingFunctions}
				/>
			))}
			<Header>Animation Easing Curves</Header>
			<Footer>
				<FooterSection>
					<div>
						<label>Duration: </label>
						<input
							type="number"
							step="1"
							min="100"
							value={duration}
							onChange={e => setDuration(parseInt(e.target.value))}
						/>
					</div>
					<div>
						<label>Alternate: </label>
						<input
							type="checkbox"
							checked={alternate}
							onChange={e => setAlternate(!!e.target.checked)}
						/>
					</div>
				</FooterSection>
				<FooterSection>
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
				</FooterSection>
				<FooterSection>Loops: {loops}</FooterSection>
			</Footer>
    </Container>
  );
}

export default App;
