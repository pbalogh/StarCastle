import App from './App';
import React, {Component} from 'react';

export default class Instructions extends Component{
  constructor(props){
    super(props);
    this.state = {
      hidden: false
    }
    this.emitter = this.props.emitter;
    this.emitter.on( App.START_GAME, this.onStartGame.bind( this ) );
    this.emitter.on( App.GAME_OVER, this.onEndGame.bind( this ) );
  }

  onStartGame(){
    this.setState( { hidden : true });
  }

  onEndGame(){
    this.setState( { hidden : false });
  }

  render(){

    if( this.state.hidden ) return null;

      return (
      <div className="title vector-text">
          LEFT AND RIGHT ARROWS TO ROTATE <p /> SPACE BAR TO FIRE <p />
          Click Anywhere to Start
      </div>
      );
  }
}