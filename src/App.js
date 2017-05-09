import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Ring from "./Ring"
import Ship from "./Ship"
import Bullet from "./Bullet"
import MicroEmitter from 'micro-emitter';
import $ from 'jquery';


const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,  
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32
};

const NUM_BULLETS_AT_ONCE = 10;

class App extends Component {

	static get LEFT(){
		return "LEFT";
	}
	
	static get RIGHT(){
		return "RIGHT";
	}

	static get ON_ENTER_FRAME(){
		return "ON_ENTER_FRAME";
	}

	constructor( props ){
		super( props );
		this.state = {
			
			radius: 100,
			rings: [],
			rotation: 0,
			keys: {}
		}		
						
		this.rotation = 0;
		this.emitter = new MicroEmitter();
		this.emitter.on( Ship.FIRE_MISSILE, this.fireMissile.bind( this ) );			
		
		this.createPoolOfBullets();
	}	
	
	createPoolOfBullets(){
		
		this.bullets = [];
		
		for( let i = 0; i < NUM_BULLETS_AT_ONCE; i++ )
		{
			this.bullets.push( <Bullet key={i} emitter={this.emitter} status={Bullet.DEAD} /> );
		}
	}
	
	
	fireMissile( missileData ){

	
		this.emitter.emit( Bullet.WANT_TO_LAUNCH_BULLET, 
		 {
			angle: missileData.angle,
			x: missileData.x,
			y: missileData.y,
			taken: false
		}
		);
	}
	
	handleKeyEvents( value, evt){
		let keys = this.state.keys;
		if( evt.keyCode === KEY.LEFT ){
		 	keys.left = value;
		}
		if( evt.keyCode === KEY.RIGHT ){
		 	keys.right = value;	
		}
		
		if( evt.keyCode === KEY.SPACE ){
		 	keys.space = value;	
		}
		
		if( evt.keyCode === KEY.UP ){
		 	keys.up = value;	
		}
		
		if( evt.keyCode === KEY.DOWN ){
		 	keys.down = value;	
		}
		
		if( evt.keyCode === KEY.SPACE && value ){
		 	this.emitter.emit( Ship.FIRE_BUTTON );	
		}
		
		return false;
	}
	
	handleResize(evt){
	
	
	}	
	
	update(){
		this.ship.respondToKeys( this.state.keys );
		this.render();
		this.setState( { rotation: this.state.rotation + .03 } );
		this.emitter.emit( App.ON_ENTER_FRAME );
		requestAnimationFrame(() => {this.update()});
	}
	
	foundLivingBullet(){
		this.hasLivingBullets = true;
	}
		
	componentDidMount() {
		window.addEventListener('keyup',   this.handleKeyEvents.bind(this, false));
		window.addEventListener('keydown', this.handleKeyEvents.bind(this, true));
		window.addEventListener('resize',  this.handleResize.bind(this, false));
		requestAnimationFrame(() => {this.update()});
	}
	
	componentWillUnmount() {
		window.removeEventListener('keyup', 	this.handleKeyEvents);
		window.removeEventListener('keydown', 	this.handleKeyEvents);
		window.removeEventListener('resize', 	this.handleResize);
	}	
	
	generateRings(){
	
		let arr = [];
		
		for( var i = 0; i < this.props.numRings; i++ )
		{
			let ring = <Ring emitter={this.emitter} key={"ring" + i} index={i} centerX={this.props.centerX} centerY={this.props.centerY} radius={this.state.radius} numSegments="12" />;
			arr.push( ring );
		}
				
		return arr;
	}	
	
	hideStartPrompt(){
	
		$('.title').addClass("hidden");
	}
	

  render() {
  
    return (
      <div className="App" onClick={this.hideStartPrompt}>

        <svg width="100%" height="600"> {this.generateRings()}
        <Ship emitter={this.emitter} angle="0" centerX={this.props.centerX} centerY={this.props.centerY} radius={this.state.radius + this.props.numRings * Ring.QUANTUM_DISTANCE } ref={(foo) => { this.ship = foo; }} />
        { this.bullets }
          </svg>
          <div className="title">
          LEFT AND RIGHT ARROWS TO ROTATE <br /> SPACE BAR TO FIRE <br />
          Click Anywhere to Start
          </div>
      </div>
    );
  }
}

export default App;
