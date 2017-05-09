import React, { Component } from 'react';
import App from './App'
import $ from "jquery";

export default class Bullet extends Component
{

	static get WANT_TO_LAUNCH_BULLET()
	{
		return "WANT_TO_LAUNCH_BULLET";
	}
	
	static get DEAD()
	{
		return "DEAD";
	}
	
	static get ALIVE()
	{
		return "ALIVE";
	}
	
	static get SPEED()
	{
		return 22;
	}

	static get MOVED_TO()
	{
		return "MOVED_TO";
	}
		
	

	constructor( props ){
		super( props );
		this.state = {
			angle : 0,
			x: 200,
			y: 200,
			status: this.props.status
			
		};
		this.emitter = this.props.emitter;
		this.emitter.on( App.ON_ENTER_FRAME, this.onEnterFrame.bind( this ) );
		this.emitter.on( Bullet.WANT_TO_LAUNCH_BULLET, this.someoneWantsBullet.bind( this ) );
		
		this.currentFrame = 0;
	}
	
	componentDidMount() {
		this.svg = $('svg');
	}
	
	someoneWantsBullet( bulletData ){
	
		if( this.state.status !== Bullet.DEAD ) return;
		
		if( bulletData.taken ) return;
		
		bulletData.taken = true;
				
		this.setState( { status : Bullet.ALIVE, x : bulletData.x, angle: bulletData.angle, y : bulletData.y });
		this.currentFrame = 0;
	
	}
	
	onEnterFrame(){
		if( this.state.status === Bullet.DEAD ) return;
		this.currentFrame++;

		if( this.currentFrame > 25 )
		{
			//alert("SETTING THIS.DEAD TO TRUE");
			this.die();	
		}
		
		this.move();
	}
	
	die(){

		this.setState( { status : Bullet.DEAD });
	}
	
	move(){
	
		let stepsTaken = 0, numSteps = 8;
	
		while( this.state.status !== Bullet.DEAD && stepsTaken < numSteps )
		{
			this.moveBy( Bullet.SPEED / numSteps );
			stepsTaken++;
		}
		
	}
	
	moveBy( distance ) {
	
		let newX = this.state.x + Math.cos( this.state.angle ) * distance;
		let newY = this.state.y + Math.sin( this.state.angle ) * distance;
		
		if( newX < 0 ) newX += this.svg.width();
		if( newY < 0 ) newY += this.svg.height();
		
		newX %= this.svg.width();
		newY %= this.svg.height();
		
		this.setState( { x : newX } );
		this.setState( { y : newY } );
		
		this.emitter.emit( Bullet.MOVED_TO, { x : this.state.x, y : this.state.y, bullet: this } );
	}
	
	render(){
	
		if( this.state.status === Bullet.DEAD ) return null;
		
		return ( 
			<g transform={this.getRotateTransform() + " " + this.getTranslateTransform() }>
				<line x1="-2" y1="-2" x2="2" y2="2" className="bullet" />
				<line x1="2" y1="-2" x2="-2" y2="2" className="bullet" />
			</g> );
	}
	
	getRotateTransform(){
		
		let transformString = "rotate(" + Math.floor( Math.random() * 360 ) + " " + this.state.x + " " + this.state.y + ")";
		return transformString;
	}

	getTranslateTransform(){
		let transformString = "translate(" + this.state.x + " " + this.state.y + ")";
		return transformString;
	}
}