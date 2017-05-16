import React, {Component} from 'react';
import App from './App';
import Ring from './Ring';

export default class Scorekeeper extends Component{
  constructor(props){
    super(props);
    this.emitter = this.props.emitter;
    this.state = {
      score : 0
    };

    this.emitter.on( App.START_GAME, this.onStartGame.bind(this) );
    this.emitter.on( Ring.HIT_SEGMENT, this.onHitSegment.bind(this) );
  }

  onHitSegment( data ){
    this.setState( { score: this.state.score + (( data.status + 1) * 10 ) });
  }

  onStartGame(){
    this.setState( { score: 0 });
  }

  getScoreAsString(){
    let scorestring = "000000000" + this.state.score;
    return scorestring.substr( scorestring.length - 9 );
  }

  render(){
    return <div className="score vector-text">
          { this.getScoreAsString( this.state.score ) }
          </div>
  }

}