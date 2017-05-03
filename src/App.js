import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from "jquery";
import Ring from "./Ring"

const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32
};




class App extends Component {

	constructor( props ){
		super( props );
		this.state = {
			
			radius: 100,
			rings: []
		}		
				
		this.setGrowthTimeout();
		
	}
	
	handleKeys( value, evt){
		let keys = this.state.keys;
		if( evt.keyCode === KEY.LEFT ) keys.left = value;
		if( evt.keyCode === KEY.RIGHT ) keys.right = value;	
	}
	
	handleResize(evt){
	
	
	}	
	
	update(){
		
	}
		
	componentDidMount() {
		window.addEventListener('keyup',   this.handleKeys.bind(this, false));
		window.addEventListener('keydown', this.handleKeys.bind(this, true));
		window.addEventListener('resize',  this.handleResize.bind(this, false));
		requestAnimationFrame(() => {this.update()});
	}
	
	componentWillUnmount() {
		window.removeEventListener('keyup', 	this.handleKeys);
		window.removeEventListener('keydown', 	this.handleKeys);
		window.removeEventListener('resize', 	this.handleResize);
	}	
	
	setGrowthTimeout() {
	
		let self = this;
	
		setTimeout( () => {

			this.rad = this.state.radius;
			console.log("rad starting at " + this.rad);   		
			$(this).animate( {
				rad: self.state.radius + 20
			}, {
		
				step: () => {
					console.log("self.rad is " + self.rad );
					self.setState({ radius: self.rad });
				},
				
				done:() =>
					self.setGrowthTimeout()
			}
			);
		
		}
		, 3000 );
		
	
	}
	
	generateRings(){
	
		let arr = [];
		
		console.log("In generateRings, this.state.radius is " + this.state.radius);
		
		for( var i = 0; i < this.props.numRings; i++ )
		{
			let ring = <Ring centerX={this.props.centerX} centerY={this.props.centerY} radius={this.state.radius} numSegments="12" />;
			console.log("New ring is " + ring );
			arr.push( ring );
		}
				
		return arr;
	}	

  render() {

	console.log("In render, this.state.rings length is " + this.state.rings.length );

    return (
      <div className="App">

        <svg width="500" height="500">{this.generateRings()}
          </svg>
      </div>
    );
  }
}

export default App;
