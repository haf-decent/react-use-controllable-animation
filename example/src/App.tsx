import { easingFunctions } from 'react-use-controllable-animation';

import './App.css';

import Panel from './Panel';

function App() {

  return (
    <div className="App">
			{Object.keys(easingFunctions).map(name => (
				<Panel
					key={name}
					easing={name as keyof typeof easingFunctions}
					duration={4000}
				/>
			))}
    </div>
  );
}

export default App;
