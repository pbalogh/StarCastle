import React, { Component } from 'react';
import App from './App';
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

	static get LIMBO()
	{
		return "LIMBO";
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
		
		this.prevX = bulletData.x;
		this.prevY = bulletData.y;
				
		this.setState( { 	status : Bullet.ALIVE, 
							x : bulletData.x, 
							y : bulletData.y,
							angle: bulletData.angle
					});
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
		this.moveBy( Bullet.SPEED );
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
		
		this.emitter.emit( Bullet.MOVED_TO, { x : this.state.x, y : this.state.y, prevX: this.prevX, prevY: this.prevY, bullet: this } );
		
		this.prevX = this.state.x;
		this.prevY = this.state.y;
	}
	
	render(){
	
		if( this.state.status === Bullet.DEAD ) return null;
		
		return ( 
			<g transform={this.getRotateTransform() + " " + this.getTranslateTransform() }>
				<line x1="-1" y1="-1" x2="1" y2="1" className="bullet" />
				<line x1="1" y1="-1" x2="-1" y2="1" className="bullet" />
			</g> );
	}
	
	getRotateTransform(){
		
		return "rotate(" + Math.floor( Math.random() * 360 ) + " " + this.state.x + " " + this.state.y + ")";
	}

	getTranslateTransform(){
	
		return "translate(" + this.state.x + " " + this.state.y + ")";
	}
}