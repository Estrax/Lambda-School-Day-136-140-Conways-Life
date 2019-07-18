import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Navbar extends React.Component {
	render() {
		return (
			<div>
				<h1>Conway's Game of Life</h1>
				<Link to='/game'>Game</Link>
				<Link to='/about'>About</Link>
				<Link to='/rules'>Rules</Link>
			</div>
		);
	}
}

Navbar.propTypes = {};

export default Navbar;
