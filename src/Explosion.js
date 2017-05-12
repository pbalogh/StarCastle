import React, { Component } from 'react';

export default class Explosion extends Component{

	static get EXPLOSION(){
		return "EXPLOSION";
	}
	
	static get REMOVE_EXPLOSION(){
		return "REMOVE_EXPLOSION";
	}

	constructor( props ){
	
		super( props );
		this.startingX = parseFloat( this.props.startingX, 10 );
		this.startingY = parseFloat( this.props.startingY, 10 );
		this.emitter = this.props.emitter;	
		this.explode( this.startingX, this.startingY );
	}

	explode( x, y ){
		this.x = x;
		this.y = y;
		this.explosionClass = this.props.color;
		setTimeout( this.die.bind( this ), 2000 );
	}
	
	die(){
		this.emitter.emit( Explosion.REMOVE_EXPLOSION, { startingX : this.startingX, startingY : this.startingY } );
	}

	render(){
					
		return ( 

			
			<g transform={ "translate( " + this.x + " " + this.y + ")" } >
				<g className={"explosion " + this.explosionClass} >
			 <path d="M-13.1-2.9l-6.1-1.5 M-12.2-0.5l-5.5-0.2 M-2-0.1h-0.2H-2 M-1.9-0.4l-0.3,0.3
			l-10.1-0.4 M-1.9-0.6l-0.3,0.5l-11-2.8 M-1.9-0.4L0.8-4 M-2.4-2l0.2,1.9l-38.3-105.2 M35.7-81.2L-1.9-0.6 M-14.6-88.8L-2.4-2
			 M-17.8-0.7L-73.7-3 M13.5,0.6L9.6,0.4 M5.8,0.2L2,0.1 M21.2,0.9l-3.9-0.2 M0.8-4L41-57.3 M17.4,0.7
			l-3.9-0.1 M53.3,14.1L8.8,2.7L5.2,1.8L1.6,0.9 M9.6,0.4L5.8,0.2 M1.6,0.9L-2-0.1 M-2,0.2l38.2,105 M69.3,2.8L21.2,0.9 M-2.1,0.2
			l12.5,88.3 M-40,81.1L-2.2-0.1l-43.1,57.2 M2,0.1L-2-0.1 M-2,0.2l-0.1-0.2L-2,0.2"/>
				</g>
			</g> );
	}
}