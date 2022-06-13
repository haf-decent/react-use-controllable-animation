import { useRef } from 'react';
import logo from './logo.svg';
import './App.css';

import useControllableAnimation, { easingFunctions } from 'react-use-controllable-animation';

function App() {
	const logoRef = useRef<HTMLImageElement>(null);

	const { start, pause, reset, stop } = useControllableAnimation({
		duration: 5000,
		onProgress: (progress: number) => {
			if (!logoRef.current) return;
	
			console.log(progress);
			logoRef.current.style.opacity = progress.toString();
		},
		easing: "easeInOutSine"
	});

  return (
    <div className="App">
        <img src={logo} className="App-logo" alt="logo" ref={logoRef}/>
				<div className="button-container">
					<button onClick={start}>START</button>
					<button onClick={pause}>PAUSE</button>
					<button onClick={reset}>RESET</button>
					<button onClick={stop}>STOP</button>
				</div>
    </div>
  );
}

export default App;
