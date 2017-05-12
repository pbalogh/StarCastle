import { Component } from 'react';
import App from './App';

export default class StarCastleEntity extends Component
{


	constructor( props ){
		super( props );

		this.emitter = this.props.emitter;
		this.emitter.on( App.ON_ENTER_FRAME, this.onEnterFrame.bind( this ) );
		window.addEventListener( "resize" , this.componentWillMount.bind( this ) );
	}

	componentWillMount(){
		this.setCenterFromProps();
	}

	setCenterFromProps(){
		this.setState({
			centerX: this.props.centerX,
			centerY: this.props.centerY,
		});
	}

	onEnterFrame(){
		this.move();
	}
}