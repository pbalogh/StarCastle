import React, { Component } from 'react';
import RingSegment from './RingSegment';
import App from './App';
import Bullet from './Bullet';
import Enemy from './Enemy';
import $ from 'jquery';

export default class Ring extends Component {
	
	static get ROTATION_SPEED(){
		return 1.1;
	}	

	static get QUANTUM_DISTANCE(){
		return 33;
	}
	
	static get RESURRECT(){
		return "RESURRECT";
	}
	
	static get FOUND_INTACT_SEGMENT(){
		return "FOUND_INTACT_SEGMENT";
	}
	
	constructor(props){
		super(props);
		this.state = {
			angle: 0,
			index: parseInt( this.props.index, 10 ),
			x: parseInt( this.props.centerX, 10 ),
			y: parseInt( this.props.centerY, 10 )
		}	
		this.radius = this.getMaxRadius();
		this.emitter = this.props.emitter;
		this.emitter.on( App.ON_ENTER_FRAME, this.onEnterFrame.bind( this ) );
		this.emitter.on( Bullet.MOVED_TO, this.onBulletMove.bind( this ) );	
		this.emitter.on( Enemy.LOOKING_FOR_SEGMENT_AT_ANGLE, this.onEnemyLookingForSegment.bind( this ) );	
		this.emitter.on( Ring.RESURRECT, this.regenerate.bind( this ) );	
		
		this.numSegments = parseInt( this.props.numSegments, 10 );	
		this.segmentStatus = [];
		for( let i = 0; i < this.numSegments; i++ )
		{
			this.segmentStatus.push( 0 );
		}
	}

	onEnemyLookingForSegment( angle ){
		let segmentIndex = this.findSegmentAtGlobalAngle( angle );
		
		if( this.segmentStatus[ segmentIndex ] < 2 )
		{
			this.emitter.emit( Ring.FOUND_INTACT_SEGMENT );
		}
	}
	
	findSegmentAtGlobalAngle( angle ){
		// make it a positive number of degrees by wrapping around 360
		let angleDiff = (( angle - this.state.angle ) + 360 ) % 360;
		let degreesPerSegment = 360 / this.numSegments;
		let seg = Math.floor( angleDiff / degreesPerSegment );
		return seg;
	}
	
	onBulletMove( bulletPosition ) {

		let radius = this.getRadius();

		let previousDelta = { x : bulletPosition.prevX - this.state.x, y : bulletPosition.prevY - this.state.y };
		
		let currentDelta = { x : bulletPosition.x - this.state.x, y : bulletPosition.y - this.state.y };		

		let previousDistance = Math.sqrt( 	previousDelta.x * previousDelta.x +
											previousDelta.y * previousDelta.y );
											
		let currentDistance = Math.sqrt( 	currentDelta.x * currentDelta.x +
											currentDelta.y * currentDelta.y );
											
		// we know we passed through this ring
		// if we either went from outside it to inside it
		// or vice versa											
		if( ( previousDistance > radius + 3 ) &&  (currentDistance > radius + 3 ) ) return;
		// we were, and still are, outside

		if( ( previousDistance < radius - 3 ) && ( currentDistance < radius - 3 ) ) return;
		// we were, and still are, inside											
		
		// still here? we crossed the radius.	
		
		let angle = Math.atan2( bulletPosition.y - this.state.y, bulletPosition.x - this.state.x );
		let globalAngle = 180 * angle / Math.PI;	
		let segmentIndex = this.findSegmentAtGlobalAngle( globalAngle );

		if( this.segmentStatus[ segmentIndex ] < 2 ) // it's a living segment
		{
			this.segmentStatus[ segmentIndex ]++;								
			bulletPosition.bullet.die();
			if( this.areAllSegmentsDead() )
			{
				this.regenerate();
			}
		}								
	}
	
	areAllSegmentsDead(){
	
		for( let i = 0; i < this.numSegments; i++ )
		{
			if( this.segmentStatus[ i ] < 2 ) return false;
		}
		
		return true;
	}
	
	regenerate(){
				
		this.radius = parseInt( this.props.radius, 10 )
		
		$( this ).animate({
		
			radius: this.getMaxRadius()
		
		});
		
		for( let i = 0; i < this.numSegments; i++ )
		{
			this.segmentStatus[ i ] = 0;
		}
		
	}
	
	getMaxRadius(){
		return parseInt( this.props.radius, 10 ) + ( this.state.index + 1 ) * Ring.QUANTUM_DISTANCE;
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
	
		return this.radius;
	}
	
	getSizeClass(){
	
		return "ring " + [ "small", "medium", "large", "huge" ][ this.state.index ];
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
		return "rotate(" + this.state.angle + " " + this.state.x + " " + this.state.y + ")";
	}
}
