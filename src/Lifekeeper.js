import React, {Component} from 'react';
import App from './App';
import Ship from './Ship';

export default class Lifekeeper extends Component{
  constructor(props){
    super(props);
    this.emitter = this.props.emitter;
    this.state = {
      lives : 3
    };

    this.emitter.on( App.START_GAME, this.onStartGame.bind(this) );
    this.emitter.on( Ship.CHANGE_STATUS, this.onShipChangeStatus.bind(this) );
  }

  onShipChangeStatus( newStatus ){
    if( newStatus === Ship.EXPLODING )
    {
      if( this.state.lives <= 1 )
      {
        alert("Game over");
        this.emitter.emit( App.GAME_OVER );
      }
      this.setState( { lives: this.state.lives - 1 });
    }
  }

  onStartGame(){
    this.setState( { lives: 3 });
  }

  getLivesAsString(){
    let scorestring = "000000000" + this.state.lives;
    return scorestring.substr( scorestring.length - 9 );
  }

  render(){
    return <div className="lives vector-text">
          { this.state.lives }
          </div>
  }

}