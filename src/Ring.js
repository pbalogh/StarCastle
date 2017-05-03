import React, { Component } from 'react';
import RingSegment from './RingSegment';

export default class Ring extends Component {

	constructor(props){
		super(props);
		this.state = {
			angle: 0,
			radius: this.props.radius
		}	
	}
	
	makeRingSegments(){
	
		console.log("In makeRingSegments, this.props.radius is " + this.props.radius );
	
		let ringSegments = [];
		
		let numSegments = parseInt( this.props.numSegments, 10 );
		
		let angleIncrement = 2 * Math.PI / numSegments;
		
		let angle = 0;
		
		let radius = parseInt( this.props.radius, 10 );
		
		let centerX = parseInt( this.props.centerX, 10 );
		
		for( let i = 0; i < numSegments; i++ )
		{
			let x1 = centerX + Math.cos( angle ) * radius;
			let y1 = centerX + Math.sin( angle ) * radius;			
			angle += angleIncrement;
			let x2 = centerX + Math.cos( angle ) * radius;
			let y2 = centerX + Math.sin( angle ) * radius;	
			ringSegments.push( <RingSegment x1={x1} y1={y1} x2={x2} y2={y2}/> );
		}
		return ringSegments;
	}

	render(){
	
		console.log("In Ring.render(), this.state.radius is " + this.state.radius );
		return(
		
			<g transform={this.getRotateTransform()}>
				{ this.makeRingSegments()}
			</g>
		
		);
	}
	
	getRotateTransform(){
	
		return "rotate(" + this.state.angle + " 0 0)";
	}
}
