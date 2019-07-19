import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Navbar extends React.Component {
	render() {
		return (
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
				<Link className='navbar-brand' to='/'>
					Conway's Game of Life
				</Link>
				<button
					className='navbar-toggler'
					type='button'
					data-toggle='collapse'
					data-target='#navbar'
					aria-controls='navbar'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon' />
				</button>

				<div className='collapse navbar-collapse' id='navbar'>
					<ul className='navbar-nav ml-auto'>
						<li className='nav-item'>
							<Link to='/' className='nav-link'>
								Game
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/about' className='nav-link'>
								About
							</Link>
						</li>
						<li className='nav-item'>
							<Link to='/rules' className='nav-link'>
								Rules
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {};

export default Navbar;
