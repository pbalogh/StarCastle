import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App numRings="3" centerX={window.innerWidth*.5} centerY={window.innerHeight * .5} radius="100" />,
  document.getElementById('root')
);

/*
	TODO: Improve appearance of cannon
	TODO: https://www.npmjs.com/package/react-sound
	TODO: Enemy can be destroyed (w animation and deactivated Ship)
	TODO: Enemy mines appear on inner rings
	TODO: Enemy mines hop out from inner rings to outer rings
	TODO: Enemy mines hop off outer rings and pursue hero in wavering path
	TODO: Ship needs state to know if it should handle key input or not
	TODO: Game needs click to start (in which case it should hide start-prompt and 
	set a timeout to tell the ship to start accepting key input)
	TODO: "remaining lives" display
	TODO: score display
	TODO: starting game resets score


DONE:
	TODO: Ship should bounce off center if it's too close
	TODO: Ship needs to tell parent where to create bullets and at what angle
	TODO: Bullets need to exist, move throughout lifespan, wraparound, and destroy selves
	TODO: Bullets also need to tell game where they are
	TODO: BULLET SHOULDN'T DIE UNLESS COLLISION
		NOTE: What if a bullet passes through two rings? How do we test outer ring first?
		HACK: What if, instead of moving all at once, a bullet steps through its movement,
		broadcasting its position at each step, and seeing if it is still alive?
		That will allow the first collision to register, and will let me choke down the distance
		between the bullet and the radius by SPEED / number-of-steps

		THEN use atan to see which segment it corresponds to
		(might need to turn off rotation to get this working
		and set segmentStatus[0] to "hit" in order to know which one is 0)
	TODO: On collision with bullet, ring needs to set segment state and tell bullet to vanish
	TODO: When vanishing, a bullet needs to make sparks and stop sending its position
	TODO: Add enemy ship
	TODO: Keyframe animation for enemy ship!	
	TODO: Enemy ship turns to face hero
	TODO: Rings must regenerate when last segment is destroyed
	TODO: Enemy fires cannon through gaps	
	TODO: Turn off machine-gun mode	
	
*/
