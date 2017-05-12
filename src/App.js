import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Ring from "./Ring";
import Ship from "./Ship";
import Enemy from "./Enemy";
import Bullet from "./Bullet";
import Cannonball from "./Cannonball";
import Explosion from "./Explosion";
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

const NUM_BULLETS_AT_ONCE = 7;

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

	static get START_GAME(){
		return "START_GAME";
	}

	constructor( props ){
		super( props );
		this.state = {

			radius: 70,
			rings: [],
			rotation: 0,
			keys: {},
			explosions: [],
			centerX: this.props.centerX,
			centerY: this.props.centerY

		}

		this.rotation = 0;
		this.emitter = new MicroEmitter();
		this.emitter.on( Ship.FIRE_MISSILE, this.fireMissile.bind( this ) );
		this.emitter.on( Explosion.REMOVE_EXPLOSION, this.removeExplosion.bind( this ) );
		this.emitter.on( Explosion.EXPLOSION, this.explode.bind( this ) );
		this.releasedSpaceBar = true; // we are ready to fire
		this.createPoolOfBullets();
		window.addEventListener('resize',  this.handleResize.bind( this ));
		this.rings = [ 0, 1, 2];
	}

	handleResize(){
		this.setState( { centerX : Math.max( window.innerWidth*.5, 400 ), centerY: Math.max( window.innerHeight *.5, 300 ) } );
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

		if( evt.keyCode === KEY.SPACE )
		{
			if( value && this.releasedSpaceBar )
			{
		 		this.emitter.emit( Ship.FIRE_BUTTON );
		 		this.releasedSpaceBar = false;
		 	}
		 	else if( !value )
		 	{
		 		this.releasedSpaceBar = true;
		 	}
		}

		return false;
	}

	update(){
		this.render();
		this.setState( { rotation: this.state.rotation + .03 } );
		this.emitter.emit( App.ON_ENTER_FRAME, this.state.keys );
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
			let ring = <Ring emitter={this.emitter} key={"ring" + i} index={i} centerX={this.state.centerX} centerY={this.state.centerY} radius={this.state.radius} numSegments="12" />;
			arr.push( ring );
		}

		return arr;
	}

	hideStartPrompt(){

		$('.title').addClass("hidden");
		this.emitter.emit( App.START_GAME );
	}

	explode( data ) {
		let explosions = this.state.explosions.slice()
		explosions.push( data ); // x, y, and color
		this.setState( { explosions: explosions } );
	}

  removeExplosion( data ){

	let explosions = this.state.explosions.filter( (explosion) => {

		return explosion.x !== data.startingX || explosion.y !== data.startingY;

  		});

	this.setState( { explosions: explosions } );
  }

  render() {
    return (
      <div className="App" onClick={this.hideStartPrompt.bind(this)}>

        <svg width="100%" height={window.innerHeight} >

        {
			this.rings.map( (i) => {
				return <Ring emitter={this.emitter} key={"ring" + i} index={i} centerX={this.state.centerX} centerY={this.state.centerY} radius={this.state.radius} numSegments="12" />
				} )
        }

        <Ship emitter={this.emitter} angle="-150" centerX={this.state.centerX} centerY={this.state.centerY}  radius={this.state.radius + this.props.numRings * Ring.QUANTUM_DISTANCE } />

        <Enemy emitter={this.emitter} centerX={this.state.centerX} centerY={this.state.centerY} radius={ this.state.radius - 10} />

        { this.bullets }

        <Cannonball emitter={this.emitter} centerX={this.state.centerX} centerY={this.state.centerY} status={Bullet.DEAD}/>

        { this.state.explosions.map( (explosion, index) => {
        	return <Explosion emitter={this.emitter} startingX={explosion.x} startingY={explosion.y} color={explosion.color}  key={index} />
        })
        }
          </svg>
          <div className="title">
          LEFT AND RIGHT ARROWS TO ROTATE <br /> SPACE BAR TO FIRE <br />
          Click Anywhere to Start
          </div>
					<div className="score">
          000000
          </div>
      </div>
    );
  }
}

export default App;
