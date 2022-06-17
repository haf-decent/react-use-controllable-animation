import { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import useControllableAnimation, { easingFunctions } from "react-use-controllable-animation";

import useScreenBreakpoint from "./useScreenBreakpoint";

import playIcon from "./play.svg";
import pauseIcon from "./pause.svg";
import skipIcon from "./skip.svg";

import AnimationPanel from "./AnimationPanel";
import Header from "./Header";

const GlobalStyle = createGlobalStyle<{ darkMode: boolean }>`
	* {
		box-sizing: border-box;
		transition: background-color 0.5s linear;
	}

	body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
			'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		${({ darkMode}) => darkMode && `background-color: #181818;`}
	}

	#root {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: auto;
	}
`;

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

const Footer = styled.div<{ darkMode: boolean, centered: boolean }>`
	position: fixed;
	bottom: 0px;
	left: 0px;
	right: 0px;
	height: 80px;
	padding: 20px;
	display: flex;
	justify-content: ${({ centered }) => centered ? "center": "space-between"};
	align-items: center;
	background-color: white;
	box-shadow: 0 7px 17px rgba(0,0,0,0.4);

	& input {
		max-width: 60px;
		outline: none;
		border: none;
		&[type="checkbox"] {
			filter: grayscale(1);
		}
	}

	${({ darkMode }) => darkMode && `
		background-color: #202020;
		color: white;
		box-shadow: 0 7px 17px rgba(0,0,0,0.8);
		& input {
			background-color: #141414;
			color: white;
			border: 1px solid rgba(255,255,255,0.5);
		}
	`}
`;
const FooterSection = styled.div<{ float?: boolean }>`
	width: 33%;
	display: flex;
	justify-content: center;
	align-items: center;

	${({ float }) => float && `
		position: fixed;
		left: 0px;
		right: 0px;
		bottom: 80px;
		width: auto;
		height: 60px;
	`}
	
	& > *:not(:first-of-type) {
		margin-left: 15px;
	}
`;
const ControlBox = styled.div<{ hidden?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	opacity: ${({ hidden }) => hidden ? "0": "1"};
`;

const Button = styled.button<{ darkMode: boolean }>`
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

	${({ darkMode }) => darkMode && `
		background-color: #181818;
		color: white;
		border-color: rgba(255,255,255,0.5);
		& > img {
			filter: invert();
		}
		& > div {
			background-color: white;
		}
	`}

	cursor: pointer;
`;

type panel = {
	dot: HTMLDivElement,
	pos: HTMLDivElement,
	bar: HTMLDivElement,
	easing: keyof typeof easingFunctions
}

const panelWidth = 300;
const panelMargin = 40;

export default function App() {
	const widthIndex = useScreenBreakpoint([ 600 ]);
	const isSmallScreen = widthIndex === 0;

	const panels = useRef(new Array(Object.keys(easingFunctions).length));

	const [ darkMode, setDarkMode ] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

	const [ isPlaying, setIsPlaying ] = useState(true);
	const [ loops, setLoops ] = useState(0);

	const [ duration, setDuration ] = useState(4000);
	const [ alternate, setAlternate ] = useState(false);
	const altRef = useRef(false);
	altRef.current = alternate;

	const [ delay, setDelay ] = useState(0);
	const [ alternateDelay, setAlternateDelay ] = useState(false);

	const { start, pause, reset, stop } = useControllableAnimation({
		duration,
		alternate,
		delay,
		alternateDelay,
		onProgress: (progress: number, { uneasedProgress, progressWithDelay, loop }) => {
			const rawX = altRef.current && loop % 2
				? 1 - uneasedProgress
				: uneasedProgress;
			
			panels.current.forEach((panel: (panel | undefined)) => {
				if (!panel) return;
				const { dot, pos, bar, easing } = panel;

				bar.style.width = `${(progressWithDelay * 100).toFixed(2)}%`;

				const easedProgress = easingFunctions[ easing ](progress);
				const x = Math.round((panelWidth - 2 * panelMargin) * rawX);
				const y = Math.round((panelWidth - 2 * panelMargin) * easedProgress);
				dot.style.left = `${x}px`;
				dot.style.bottom = `${y}px`;

				pos.children[0].textContent = `x: ${x}px (${uneasedProgress.toFixed(3)})`;
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
		<>
			<GlobalStyle darkMode={darkMode}/>
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
						darkMode={darkMode}
					/>
				))}
				<Header
					title="Animation Easing Curves"
					isSmall={isSmallScreen}
					darkMode={darkMode}
					toggleDarkMode={() => setDarkMode(d => !d)}
				/>
				<Footer
					darkMode={darkMode}
					centered={isSmallScreen}>
					<FooterSection>
						<ControlBox>
							<label>Dur: </label>
							<input
								type="number"
								step="1"
								min="100"
								value={duration}
								onChange={e => setDuration(parseInt(e.target.value))}
							/>
						</ControlBox>
						<ControlBox>
							<label>Alternate: </label>
							<input
								type="checkbox"
								checked={alternate}
								onChange={e => setAlternate(!!e.target.checked)}
							/>
						</ControlBox>
						<ControlBox>
							<label>Delay: </label>
							<input
								type="number"
								step="1"
								min="0"
								value={delay}
								onChange={e => setDelay(parseInt(e.target.value))}
							/>
						</ControlBox>
						<ControlBox hidden={!alternate}>
							<label>Alt. Delay: </label>
							<input
								type="checkbox"
								checked={alternateDelay}
								onChange={e => setAlternateDelay(!!e.target.checked)}
							/>
						</ControlBox>
					</FooterSection>
					<FooterSection float={isSmallScreen}>
						<Button
							darkMode={darkMode}
							onClick={() => setIsPlaying(p => !p)}>
							<img src={isPlaying ? pauseIcon: playIcon} alt=">"/>
						</Button>
						<Button
							darkMode={darkMode}
							onClick={() => {
								reset();
								setLoops(0);
							}}>
							<img src={skipIcon} alt="|>" style={{ transform: `scaleX(-1)` }}/>
						</Button>
						<Button
							darkMode={darkMode}
							onClick={() => {
								stop();
								setIsPlaying(false);
								setLoops(0);
							}}>
							<div></div>
						</Button>
					</FooterSection>
					{!isSmallScreen && (
						<FooterSection>Loops: {loops}</FooterSection>
					)}
				</Footer>
			</Container>
		</>
  );
}
