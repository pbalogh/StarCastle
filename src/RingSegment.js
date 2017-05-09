import React, { Component } from 'react';

export default class RingSegment extends Component {
	constructor(props){
		super(props);
		this.state = {
			hitstatus: parseInt( this.props.hitstatus, 10 )
		}
		this.index = this.props.index;
	}
	
	getHitStatus(){
		// when our parent passes us new values in a prop, it updates without affecting our state in any way
		switch( this.props.hitstatus )
		{

			case 0:
				return "unhit";
			case 1:
				return "hit";
			case 2:
				return "broken";
			default:
				return "broken";
		}
	}

	render(){
		return <line x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} className={this.getHitStatus() } y2={this.props.y2} />;
	}

}
