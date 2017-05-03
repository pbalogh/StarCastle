import React, { Component } from 'react';

export default class RingSegment extends Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	

	render(){
		return <line x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} stroke="black" strokeWidth="2" />;
	}

}
