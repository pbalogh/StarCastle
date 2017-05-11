import React, { Component } from 'react';
import App from './App';
import Bullet from './Bullet';
import Enemy from './Enemy';
import $ from "jquery";

export default class Cannonball extends Component
{

	static get CANNONBALL_MOVED_TO(){
		return "CANNONBALL_MOVED_TO";
	}
	
	static get SPEED(){
		return 30;
	}

	constructor( props ){
		super( props );
		this.state = {
			angle : this.props.angle,
			x: parseInt( this.props.centerX, 10 ),
			y: parseInt( this.props.centerY, 10 ),
			status: this.props.status
		};
		this.emitter = this.props.emitter;
		this.emitter.on( App.ON_ENTER_FRAME, this.onEnterFrame.bind( this ) );
		this.emitter.on( Enemy.FIRE_CANNON, this.fireCannon.bind( this ) );		
		
		this.currentFrame = 0;
	}
	
	fireCannon( angle ){
	
		if( this.state.status != Bullet.DEAD ) return; // already in flight or in limbo
		
		this.setState( { 
							x: parseInt( this.props.centerX, 10 ), 
							y : parseInt( this.props.centerY, 10 ), 
							status : Bullet.ALIVE,
							angle: angle * Math.PI/180 // convert degrees CW to radians CCW
							});
	}
	
	componentDidMount() {
		this.svg = $('svg');
	}	
	
	onEnterFrame(){
		if( this.state.status !== Bullet.ALIVE ) return;		
		this.move();
	}
	
	die(){

		this.setState( { status : Bullet.DEAD });
	}
	
	limbo(){
		if( this.state.status === Bullet.LIMBO ) return;
		this.setState( { status : Bullet.LIMBO });
		setTimeout( this.die.bind( this ), 1000 ); // delay before we can fly again
	}
	
	
	move() {
	
		this.setState( { x : this.state.x + Math.cos( this.state.angle ) * Cannonball.SPEED } );
		this.setState( { y : this.state.y + Math.sin( this.state.angle ) * Cannonball.SPEED } );
		
		if( this.state.x < -20 ) this.limbo();
		if( this.state.y < -20 ) this.limbo();
		
		if( this.state.x > this.svg.width() ) this.limbo();
		if( this.state.y > this.svg.height() ) this.limbo();
		

		
		this.emitter.emit( Cannonball.CANNONBALL_MOVED_TO, { x : this.state.x, y : this.state.y, cannonball: this } );
	}
	
	render(){
	
		if( this.state.status !== Bullet.ALIVE ) return null;
		
		return ( 
			<g transform={this.getRotateTransform() + " " + this.getTranslateTransform() }>
				<line x1="-5" y1="-5" x2="5" y2="5" className="bullet" />
				<line x1="5" y1="-5" x2="-5" y2="5" className="bullet" />
			</g> );
	}
	
	getRotateTransform(){
		
		return "rotate(" + Math.floor( Math.random() * 360 ) + " " + this.state.x + " " + this.state.y + ")";
	}

	getTranslateTransform(){
		return "translate(" + this.state.x + " " + this.state.y + ")";
	}
}