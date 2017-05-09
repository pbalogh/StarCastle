import React, { Component } from 'react';
import RingSegment from './RingSegment';
import App from './App';
import Bullet from './Bullet';

export default class Ring extends Component {

	constructor(props){
		super(props);
		this.state = {
			angle: 0,
			index: parseInt( this.props.index, 10 ),
			x: parseInt( this.props.centerX, 10 ),
			y: parseInt( this.props.centerY, 10 )
		}	
		this.emitter = this.props.emitter;
		this.emitter.on( App.ON_ENTER_FRAME, this.onEnterFrame.bind( this ) );
		this.emitter.on( Bullet.MOVED_TO, this.onBulletMove.bind( this ) );	
		this.numSegments = parseInt( this.props.numSegments, 10 );	
		this.segmentStatus = [];
		for( let i = 0; i < this.numSegments; i++ )
		{
			this.segmentStatus.push( 0 );
		}
	}
	
	static get ROTATION_SPEED(){
		return 1.1;
	}	

	static get QUANTUM_DISTANCE(){
		return 22;
	}
	
	onBulletMove( bulletPosition ) {

		let radius = this.getRadius();
		
		if( bulletPosition.x < this.state.x - radius ) return;
		if( bulletPosition.x > this.state.x + radius ) return;	
		
		if( bulletPosition.y < this.state.y - radius ) return;
		if( bulletPosition.y > this.state.y + radius ) return;			
		

		let seg = this.whichSegmentIsItHitting( bulletPosition.x, bulletPosition.y );
		if( seg == null ) return;
		
		if( this.segmentStatus[ seg ] < 2 ) // it's a living segment
		{
			this.segmentStatus[ seg ]++;								
			bulletPosition.bullet.die();
		}

	
	}
	
	//whichSegmentIsItHitting( bullet_distance_x, bullet_distance_y ){
	whichSegmentIsItHitting( bullet_x, bullet_y ){
		
		// remember, each segment's position has the center of the ring added to it
		// so let's subtract the ring's center from the bullet's position
		// to determine their relative position
		
		bullet_x -=  + this.state.x;
		bullet_y -=  + this.state.y;		
		
		let angleIncrement = 2 * Math.PI / this.numSegments;
		let angle = this.state.angle * Math.PI / 180;
		for( let i = 0; i < this.numSegments; i++ )
		{
			let ep = this.getEndpointsOfSegmentBetweenAngles( angle, angle + angleIncrement );
			angle += angleIncrement;
			if( bullet_x > ep.x1 && bullet_x > ep.x2 ) continue;
			if( bullet_x < ep.x1 && bullet_x < ep.x2 ) continue;
			if( bullet_y > ep.y1 && bullet_y > ep.y2 ) continue;
			if( bullet_y < ep.y1 && bullet_y < ep.y2 ) continue;
			return i;						
		}			
		return null;
	}
	
	makeRingSegments(){
		
		let ringSegments = [];
		
		let angleIncrement = 2 * Math.PI / this.numSegments;
		// angle is in CW-positive degrees -- need to convert to CCW radians
		let angle = 0;

		for( let i = 0; i < this.numSegments; i++ )
		{
			let ep = this.getEndpointsOfSegmentBetweenAngles( angle, angle + angleIncrement );
			let status = this.segmentStatus[ i ];
			ringSegments.push( <RingSegment ringnum={ this.state.index } key={"seg" + i} index={i} hitstatus={ status } x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2}/> );
			angle += angleIncrement;
		}

		return ringSegments;
	}
	
	getEndpointsOfSegmentBetweenAngles( firstAngle, secondAngle ){
	
		let radius = this.getRadius();
		
		return {
			x1 : Math.cos( firstAngle ) * radius,
			y1 : Math.sin( firstAngle ) * radius,			
			x2 : Math.cos( secondAngle ) * radius,
			y2 : Math.sin( secondAngle ) * radius	
		}
	}
	
	getRadius(){
		 return parseInt( this.props.radius, 10 ) + this.state.index * Ring.QUANTUM_DISTANCE;
	}
	
	getSizeClass(){
	
		let radius = this.getRadius();
	
		if( radius < 125 )
		{
			return "ring small";
		}
		else if( radius < 145 )
		{
			return "ring medium";
		}
		else if( radius < 165 )
		{
			return "ring large";
		}
		else
		{
			return "ring huge";
		}
		
	
	}
	
	onEnterFrame(){
		this.setState( { angle: this.getNewAngle() } );		
	}
	
	getNewAngle(){
		let delta_angle = ( this.state.index % 2 === 1 ) ? Ring.ROTATION_SPEED : -Ring.ROTATION_SPEED;

		return ( this.state.angle + delta_angle ) % 360;
	}

	render(){
		
		return(
		
			<g transform={this.getRotateTransform() + " " + this.getTranslateTransform()} className={this.getSizeClass()}>
				{ this.makeRingSegments()}
			</g>
		
		);
	}
	
	getTranslateTransform(){
		
		let transformString = "translate(" + this.state.x + " " + this.state.y + ")";
		return transformString;
	}
	
	getRotateTransform(){
		return "rotate(" + this.state.angle + " " + this.props.centerX * 1 + " " + this.props.centerY * 1 + ")";
	}
}
