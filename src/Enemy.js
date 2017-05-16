import React from 'react';
import Ship from './Ship';
import Ring from './Ring';
import Bullet from './Bullet';
import Explosion from './Explosion';
import StarCastleEntity from './StarCastleEntity';

// StarCastleEntity has basic centering, resize, emitter, and onEnterFrame handlers
export default class Enemy extends StarCastleEntity
{
	static get LOOKING_FOR_SEGMENT_AT_ANGLE(){
		return "LOOKING_FOR_SEGMENT_AT_ANGLE";
	}

	static get FIRE_CANNON(){
		return "FIRE_CANNON";
	}

	static get ALIVE(){
		return "ALIVE";
	}

	static get EXPLODING(){
		return "EXPLODING";
	}


	constructor( props ){
		super( props );
		this.state = {
			angle : 0,
			status: Enemy.ALIVE,
			radius: parseInt( this.props.radius, 10 )
		};

		this.angle_velocity = 0;
		this.emitter.on( Ship.POSITION, this.onShipMove.bind( this ) );
		this.emitter.on( Ring.FOUND_INTACT_SEGMENT, this.onFoundSegmentAtAngle.bind( this ) );
		this.emitter.on( Bullet.MOVED_TO, this.onBulletMove.bind( this ) );
		this.emitter.on( Ship.CHANGE_STATUS, this.onShipChangeStatus.bind( this ) );
	}

	onShipChangeStatus( newStatus ){
		this.shipStatus = newStatus;
	}

	onShipMove( shipPosition ){

		let angle = Math.atan2( shipPosition.y - this.state.centerY, shipPosition.x - this.state.centerX );
		angle *= 180/ Math.PI; // convert radians to degrees, CCW to CW
		let angle_diff = this.state.angle - angle;
		this.angle_velocity = angle_diff * .03;
	}

	onBulletMove( bulletPosition ){

		if( this.state.status !== Enemy.ALIVE ) return; // can only get shot when alive

		let deltaX = bulletPosition.x - this.state.centerX;
		let deltaY = bulletPosition.y - this.state.centerY;

		let distance = Math.sqrt( deltaX * deltaX + deltaY * deltaY );
		if( distance < this.state.radius )
		{
			this.explode();
		}
	}

	explode(){
		this.setState( { status : Enemy.EXPLODING } );
		this.emitter.emit( Explosion.EXPLOSION, { x: this.state.centerX, y: this.state.centerY, color: "yellow" } );
		setTimeout( this.resurrect.bind( this ), 4000 );
	}

	resurrect(){
		this.setState( { status : Enemy.ALIVE } );
		this.emitter.emit( Ring.RESURRECT );
	}

	move(){
		if( this.state.status !== Enemy.ALIVE ) return;
		if( this.shipStatus !== Ship.ALIVE ) return;
		this.setState( { angle : this.state.angle - this.angle_velocity } );
		this.blockedBySegmentAtAngle = false;
		this.emitter.emit( Enemy.LOOKING_FOR_SEGMENT_AT_ANGLE, this.state.angle );
		if( ! this.blockedBySegmentAtAngle )
		{
			this.emitter.emit( Enemy.FIRE_CANNON, this.state.angle );
		}
	}

	onFoundSegmentAtAngle(){
		this.blockedBySegmentAtAngle = true;
	}

	render(){

		if( this.state.status !== Enemy.ALIVE ) return null;

		return (
			<g transform={this.getRotateTransform() + " " + this.getTranslateTransform()} className="enemy">


			<g transform="matrix( 1, 0, 0, 1, 10.75,-14.85) ">
	<g transform="matrix( 1, 0, 0, 1, 0,0) ">
		<g>
			<path id="cannon_tophalf_0_Layer0_0_1_STROKES" d="M-26.7,14.6l-4.8-20.4L-19.2-1l-3.6-15.6L0.5-6.9l8.8,17.2
				L-19.2-1l2.5,9.6L16,14.1"/>
		</g>
	</g>
</g>
<g transform="matrix( 1, 0, 0, -1, 10.75,14.65) ">
	<g transform="matrix( 1, 0, 0, 1, 0,0) ">
		<g>
			<path id="cannon_tophalf_0_Layer0_0_1_STROKES_1_" d="M-26.7,14.6l-4.8-20.3L-19.2-1l-3.6-15.6L0.5-6.9l8.8,17.1
				L-19.2-1l2.5,9.6L16,14.1"/>
		</g>
	</g>
</g>



			<path className="zapper" d="M-21.2-0.5l-4.5,15 M-21.2-0.5l-4.5-15" />

			 <path className={this.getExplosionClass()} d="M-13.1-2.9l-6.1-1.5 M-12.2-0.5l-5.5-0.2 M-2-0.1h-0.2H-2 M-1.9-0.4l-0.3,0.3
			l-10.1-0.4 M-1.9-0.6l-0.3,0.5l-11-2.8 M-1.9-0.4L0.8-4 M-2.4-2l0.2,1.9l-38.3-105.2 M35.7-81.2L-1.9-0.6 M-14.6-88.8L-2.4-2
			 M-17.8-0.7L-73.7-3 M13.5,0.6L9.6,0.4 M5.8,0.2L2,0.1 M21.2,0.9l-3.9-0.2 M0.8-4L41-57.3 M17.4,0.7
			l-3.9-0.1 M53.3,14.1L8.8,2.7L5.2,1.8L1.6,0.9 M9.6,0.4L5.8,0.2 M1.6,0.9L-2-0.1 M-2,0.2l38.2,105 M69.3,2.8L21.2,0.9 M-2.1,0.2
			l12.5,88.3 M-40,81.1L-2.2-0.1l-43.1,57.2 M2,0.1L-2-0.1 M-2,0.2l-0.1-0.2L-2,0.2"/>

			</g> );
	}

	getExplosionClass(){
		return "hidden";
	}

	getRotateTransform(){

		let transformString = "rotate(" + this.state.angle + " " + this.state.centerX + " " + this.state.centerY + ")";
		return transformString;
	}

	getTranslateTransform(){
		let transformString = "translate(" + this.state.centerX + " " + this.state.centerY + ")";
		return transformString;
	}
}