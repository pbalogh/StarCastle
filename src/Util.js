
	export function makeAssertions(){
	
		function assert( bool, stmt ){
	
			if( !bool ) console.error( stmt );
		}
	
		// 2 o'clock collision
		let impactAngle = this.getCCWAngleInDegreesFromPoints( 190, 10, 100, 100 );
		assert( impactAngle === 45, "impactAngle should be 45 but is " + impactAngle );
		impactAngle = this.getCCWAngleInDegreesFromPoints( 10, 10, 100, 100 );
		assert( impactAngle === 135, "impactAngle should be 135 but is " + impactAngle );
		
		let reflectionAngle = this.calculateCCWReflectionAngle( 45, 225 );
		assert( reflectionAngle === 45, "reflectionAngle should be 45 but is " + reflectionAngle );

		reflectionAngle = this.calculateCCWReflectionAngle( 45, 210 );
		assert( reflectionAngle === 60, "reflectionAngle should be 60 but is " + reflectionAngle );

		reflectionAngle = this.calculateCCWReflectionAngle( 135, -45 );
		assert( reflectionAngle === 135, "reflectionAngle should be 135 but is " + reflectionAngle );

		reflectionAngle = this.calculateCCWReflectionAngle( 135, -60 );
		assert( reflectionAngle === 150, "reflectionAngle should be 150 but is " + reflectionAngle );

		reflectionAngle = this.calculateCCWReflectionAngle( 135, -30 );
		assert( reflectionAngle === 120, "reflectionAngle should be 120 but is " + reflectionAngle );

	}
	
	
	export function calculateCCWReflectionAngle( impactAngle, shipAngle ){

		let flippedAngle = ( shipAngle + 180 ) % 360;
		
		return 2 * impactAngle - flippedAngle;
		
	}


	export function getCCWAngleInDegreesFromPoints( x, y, center_x, center_y ){
		let deltaX = x - center_x;
		let deltaY = center_y - y;
		let angleFromCenterRads = Math.atan2( deltaY, deltaX );
		return Math.floor( ( angleFromCenterRads * 180/Math.PI ) % 360 );
	}

