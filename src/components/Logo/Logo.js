import React from 'react';
import Tilt from 'react-tilt';
import Brain from './icons8-brain-64.png'
import './Logo.css';

const Logo = () => {
	return(
		<div className = 'ma4 mt0'>
			<Tilt className="br2 shadow-2" options={{ max : 55 }} style={{ height: 120, width: 120 }} >
				<div className="pa3">
					<img style = {{paddingTop: '6px'}} alt = "Logo" src = {Brain} /> 
				</div>
			</Tilt>
		</div>
	);
}

export default Logo;