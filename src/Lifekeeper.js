import React, {Component} from 'react';
import App from './App';
import Ship from './Ship';

export default class Lifekeeper extends Component{
  constructor(props){
    super(props);
    this.emitter = this.props.emitter;
    this.state = {
      lives : 0
    };

    this.emitter.on( App.START_GAME, this.onStartGame.bind(this) );
    this.emitter.on( Ship.CHANGE_STATUS, this.onShipChangeStatus.bind(this) );
  }

  onShipChangeStatus( newStatus ){
    if( newStatus === Ship.EXPLODING )
    {
      console.log("Hearing explosiong and this.state.lives is " + this.state.lives );
      if( this.state.lives <= 1 )
      {
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
    return scorestring.substr( scorestring.length - 9 );;
  }

  render(){
    return <div className="lives">
          { this.getLivesAsString( this.state.lives ) }
          </div>
  }

}