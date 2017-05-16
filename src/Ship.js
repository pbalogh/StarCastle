import React from 'react';
import App from './App';
import Cannonball from './Cannonball';
import $ from "jquery";
import * as Util from './Util';
import Explosion from './Explosion';
import StarCastleEntity from './StarCastleEntity';

// StarCastleEntity has basic centering, resize, emitter, and onEnterFrame handlers
export default class Ship extends StarCastleEntity {

	static get ROTATION_SPEED(){
		return 3;
	}

	static get THRUST_SPEED(){
		return .3;
	}

	static get MAX_SPEED(){
		return 9;
	}

	static get FIRE_BUTTON(){
		return "FIRE_BUTTON";
	}

	static get FIRE_MISSILE(){
		return "FIRE_MISSILE";
	}

	static get POSITION(){
		return "POSITION";
	}

	static get EXPLODING(){
		return "EXPLODING";
	}

	static get ALIVE(){
		return "ALIVE";
	}

	static get LIMBO(){
		return "LIMBO";
	}

	static get CHANGE_STATUS(){
		return "CHANGE_STATUS";
	}

	constructor(props){
		super(props);
		this.centerX = parseInt( this.props.centerX, 10 );
		this.centerY = parseInt( this.props.centerY, 10 );
		this.radius = parseInt( this.props.radius, 10 ) + 10;
		// randomize where we appear so that we don't always show up in same place.
		// otherwise, the cannon will just grief us every time.
		// put us either near 3 o'clock or near 9 o'clock

		this.state = {
			x : 0,
			y: 0,
			angle : 0,
			status: Ship.LIMBO
		}

		this.doppelganger = { class: "hidden", x : 0, y : 0 };
		this.speed = 0;
		this.velocity = { x : 0, y : 0 };
		this.onFireButton = this._onFireButton.bind( this );
		this.emitter.on( Ship.FIRE_BUTTON, this.onFireButton );
		this.emitter.on( App.START_GAME, this.onStartGame.bind( this ) );
		this.emitter.on( App.GAME_OVER, this.onEndGame.bind( this ) );
		this.emitter.on( Cannonball.CANNONBALL_MOVED_TO, this.onCannonballMovedTo.bind( this ) );

		Util.makeAssertions();

	}

	onStartGame(){
		this.setStatus( Ship.ALIVE );
	}

	onEndGame(){
		this.setStatus( Ship.LIMBO );
	}

	// make sure enemies know we're alive, dead, etc. so they can modify *their* state
	setStatus( newStatus ){
		this.setState( { status: newStatus } );
		this.emitter.emit( Ship.CHANGE_STATUS, newStatus );
	}

	onEnterFrame( keys ){
		this.respondToKeys( keys );
		this.move();
		this.testForRingCollision();
	}

	onCannonballMovedTo( position ){
		if( this.state.status !== Ship.ALIVE ) return;
		let deltaX = position.x - this.state.x;
		let deltaY = position.y - this.state.y;
		let distance = Math.sqrt( deltaX * deltaX + deltaY * deltaY );
		if( distance < 30 )
		{
			this.explode();
		}
	}

	explode(){
		this.setStatus( Ship.EXPLODING );
		this.emitter.emit( Explosion.EXPLOSION, { x: this.state.x, y: this.state.y, color: "blue" } );
		setTimeout( this.resurrect.bind( this ), 4000 );
	}

	resurrect(){
		this.emitter.emit( Ship.CHANGE_STATUS, Ship.ALIVE );
		this.randomizeAngleAndPosition();
		this.setState( { status : Ship.ALIVE } );
	}

	randomizeAngleAndPosition(){
		let piWedge = Math.PI * .3;
		let angle = piWedge * .5 - Math.random() * piWedge;
		if( Math.random() > .55 )
		{
			angle += Math.PI;
		}

		this.setState( { 	angle : 180 + angle * 180 / Math.PI, // our rotation should be facing in, in degrees
											x: this.centerX + Math.cos( angle ) * ( this.radius + 80 ),
											y: this.centerY + Math.sin( angle ) * ( this.radius + 80)
									});
	}

	testForRingCollision(){

		let deltaX = this.state.x - this.state.centerX;
		let deltaY = this.state.y - this.state.centerY;

		let distanceFromCenterSquared = Math.pow( deltaX, 2 ) + Math.pow( deltaY, 2 );
		let distance = Math.sqrt( distanceFromCenterSquared );

		if( distance < this.radius )
		{
			this.bounceOffRings();
		}
	}

	bounceOffRings(){
		// convert CCW-positive to CW-positive angle by * -1
		this.setState( { angle: -this.getNewAngle()  } );
		this.move( 30 );
	}

	getNewAngle(){

		let angleOfPointOfImpact = Util.getCCWAngleInDegreesFromPoints(
			this.state.x,
			this.state.y,
			this.centerX,
			this.centerY,
		);
		// because positive Y is down toward bottom of screen in svg,
		// a positive rotation in SVG is clockwise and in degrees, not radians.
		// but in trig, it's CCW-positive and measured in radians.
		// so we'll work with CCW and degrees
		// to do all our math
		// and then convert to CW-positive degrees to plug back into ship.
		let shipAngleInCCWDegrees = this.state.angle * -1; // CCW-positive degrees

		let reflectionAngleCCW = Util.calculateCCWReflectionAngle( 	angleOfPointOfImpact,
																	shipAngleInCCWDegrees );
		return reflectionAngleCCW;
	}

	move( jumpDistance ){

		if( this.state.status !== Ship.ALIVE ) return;

		this.speed *= .98;

		if( this.speed < .01 ) this.speed = 0;

		let amountToMove = jumpDistance ? jumpDistance : this.speed;

		let angleRads = this.state.angle * Math.PI / 180;

		this.velocity = {
			x : Math.cos( angleRads ) * amountToMove,
			y : Math.sin( angleRads ) * amountToMove,
		}

		let width = this.svg.width();
		let height = this.svg.height();

		let newPosition = {
							x : this.state.x + this.velocity.x,
							y : this.state.y + this.velocity.y
						};

		newPosition.x %= width;
		newPosition.y %= height;

		if( newPosition.x < -20 ) newPosition.x += width;
		if( newPosition.y < -20 ) newPosition.y += height;

		this.setState( { x : newPosition.x } );
		this.setState( { y : newPosition.y } );

		this.emitter.emit( Ship.POSITION, { x : newPosition.x, y : newPosition.y } );
	}


	componentDidMount() {
		this.svg = $('svg');
		this.randomizeAngleAndPosition();
	}

	_onFireButton(){
		this.fireMissile();
	}

	fireMissile(){
		if( this.state.status !== Ship.ALIVE ) return;
		this.emitter.emit( Ship.FIRE_MISSILE, { x: this.state.x, y : this.state.y, angle : this.state.angle * Math.PI / 180 } );
	}

	respondToKeys( keys ){
		if( this.state.status !== Ship.ALIVE ) return;
		if( keys.left ) this.rotate( App.LEFT );
		if( keys.right ) this.rotate( App.RIGHT );
		if( keys.up ) this.goFaster();
		if( keys.down ) console.log("this.state.angle is " + this.state.angle );
	}

	rotate( direction ){

		let rotSpeed = ( direction === App.LEFT ) ? -Ship.ROTATION_SPEED : Ship.ROTATION_SPEED;
		this.setState( { angle: this.state.angle + rotSpeed } );
	}

	goFaster(){
		this.speed += Ship.THRUST_SPEED;
		this.speed = Math.min( this.speed, Ship.MAX_SPEED );
	}

	render(){

		if( this.state.status === Ship.EXPLODING ) return null;

		return(

			<g>
				<g className="ship" transform={this.getRotateTransform() + " " + this.getTranslateTransform() }>
					<path stroke="#6600FF" fill="none" d="
					M -16.6 -7.6
					L -16.275 -7.575 -8.875 -6.75 -14.35 -15.75 -0.625 -5.8 20.95 -3.35
					M 7.9 0.225
					L -0.625 -5.8 -8.875 -6.75 -3.8 -0.35 -3.475 -0.175
					M -3.8 -0.35
					L -16.275 -7.575
					M -7.575 8.025
					L -3.8 0.975 -14.45 8.75 -7.575 8.025 0.2 6.675 7.7 0.5
					M -3.8 0.975
					L -2.975 0.375
					M 21.325 2.9
					L 0.2 6.675 -12.225 16.85 -7.575 8.025"/>
				</g>

				<g id="doppelganger" className={this.doppelganger.class } transform={this.getDoppelgangerRotateTransform() + " " + this.getDoppelgangerTranslateTransform() }>
					<path stroke="#6600FF" fill="none" d="
					M -16.6 -7.6
					L -16.275 -7.575 -8.875 -6.75 -14.35 -15.75 -0.625 -5.8 20.95 -3.35
					M 7.9 0.225
					L -0.625 -5.8 -8.875 -6.75 -3.8 -0.35 -3.475 -0.175
					M -3.8 -0.35
					L -16.275 -7.575
					M -7.575 8.025
					L -3.8 0.975 -14.45 8.75 -7.575 8.025 0.2 6.675 7.7 0.5
					M -3.8 0.975
					L -2.975 0.375
					M 21.325 2.9
					L 0.2 6.675 -12.225 16.85 -7.575 8.025"/>

				</g>
			</g>
		);
	}

	getRotateTransform(){

		let transformString = "rotate(" + this.state.angle + " " + this.state.x + " " + this.state.y + ")";
		return transformString;
	}

	getDoppelgangerRotateTransform(){

		let transformString = "rotate(" + this.state.angle + " " + this.doppelganger.x + " " + this.doppelganger.y + ")";
		return transformString;
	}

	getTranslateTransform(){
		let transformString = "translate(" + this.state.x + " " + this.state.y + ")";
		return transformString;
	}

	// if we go off the right side, our nose appears on the left side until we wrap around
	getDoppelgangerTranslateTransform(){
		if( ! this.svg ) return "";
		let stagewidth = this.svg.width();
		let stageheight = this.svg.height();
		this.doppelganger.x = this.state.x;
		this.doppelganger.y = this.state.y;
		this.doppelganger.class = "hidden";
		// overlapping right edge
		if( this.state.x > stagewidth - 20 )
		{
			this.doppelganger.x = this.state.x - stagewidth;
			this.doppelganger.class = ""; // remove 'hidden'
		}

		// overlapping left edge
		if( this.state.x < 20 )
		{
			this.doppelganger.x = this.state.x + stagewidth;
			this.doppelganger.class = ""; // remove 'hidden'
		}

		// overlapping bottom edge
		if( this.state.y > stageheight - 20 )
		{
			this.doppelganger.y = this.state.y - stageheight;
			this.doppelganger.class = ""; // remove 'hidden'
		}

		// overlapping top edge
		if( this.state.y < 20 )
		{
			this.doppelganger.y = this.state.y + stageheight;
			this.doppelganger.class = ""; // remove 'hidden'
		}


		let transformString = "translate(" + this.doppelganger.x + " " + this.doppelganger.y + ")";
		return transformString;
	}

}
