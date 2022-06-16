# react-use-controllable-animation
A React hook for creating animations with start/pause/stop/reset controls

## Installation
`npm install react-use-controllable-animation`

## How to Use
Import or require the default export `useControllableAnimation`. The module also exports `easingFunctions` if needed by your application.

### Parameters
The hook accepts an object with the following parameters:
| Parameter | type    | default                      | description                                                                                                              |
|-----------|---------|------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| autoplay       | `boolean`              | true      | Specify if the animation should begin on initialization
| alternate      | `boolean`              | false     | Specify if the animation should run backwards every other loop (i.e. loop 1: 0 -> 1, loop 2: 1 -> 0)
| alternateDelay | `boolean`              | false     | Specify if the delay should be applied on every loop or every other loop (only affects animation if `alternate` is set to `true`)
| delay          | `number`               | 0         | Amount of time in ms to delay the animation
| duration       | `number`               | 1000      | Duration of the animation in ms
| easing         | `string` or `function` | "linear"  | Specify the name of the easing function to use (must be one of the keys exported in `easingFunctions`) or define your own custom easing function ((val: number[0-1]) => number[0-1])
| loops          | `number`               | Infinity  | Number of times animation should run before stopping (Note: alternating animations count each 0-1 or 1-0 as a loop)
| onFinish       | `function`             | undefined | Callback to be run after the animation completes running `loops` times
| onLoop         | `function`             | undefined | Callback to be run after each loop completes. Passes current loop as argument.
| onProgress     | `function`             |           | Callback to be run on each frame. Passes `progress` (with easing) and an object including `uneasedProgress`, `progressWithDelay`, and `loop` as arguments.

### Returns
The hook returns an object with the following function properties:

`start` - begins/unpauses the animation if it's not already running

`pause` - pauses the animation on the current frame

`reset` - resets the animation to the initial state (progress = 0, loop = 0) without starting or pausing the animation

`stop`  - pauses the animation and resets it


### Example
```jsx
import { useCallback, useEffect, useState } from "react";
import useControllableAnimation, { easingFunctions } from "react-use-controllable-animation";

function Example() {
  const [ bounceEl, setBounceEl ] = useState();
  const [ sineEl, setSineEl ] = useState();
  
  const onProgress = useCallback((progress, { uneasedProgress, progressWithDelay, loop }) => {
    if (!bounceEl || !sineEl) return;
    
    bounceEl.style.left = `${(progress * 100).toFixed(2)}%`;
    sineEl.style.left = `${(easingFunctions.easeInOutSine(uneasedProgress)) * 100).toFixed(2)}%`;
    
    console.log(`Overall animation progress including delay time: ${progressWithDelay}`);
    console.log(`Current loop: ${loop}`);
  }, [ bounceEl, sineEl ]);
  
  const { start, pause, reset, stop } = useControllableAnimation({
    autoplay: !!bounceEl && !!sineEl,
    alternate: true,
    alternateDelay: true,
    delay: 1000,
    duration: 2000,
    easing: "easeInBounce",
    onProgress
  });
  
  return (
    <div>
      <div ref={setBounceEl}/>
      <div ref={setSineEl}/>
      <button onClick={start}>START</button>
      <button onClick={pause}>PAUSE</button>
      <button onClick={reset}>RESET</button>
      <button onClick={stop}>STOP</button>
    </div>
  );
}
    
```

## Demo
The package includes a demo found in the `example` folder. You can either build it yourself (`npm install react-use-controllable-animation && npm run start`), or view a live version at this link:

https://react-use-controllable-animation.netlify.app

## Enjoy
