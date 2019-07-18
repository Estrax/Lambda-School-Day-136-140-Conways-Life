import React from 'react';
import PropTypes from 'prop-types';
import { Game } from '../components';

class GamePage extends React.Component {
	render() {
		return (
			<div>
				<h1>GamePage</h1>
				<Game />
			</div>
		);
	}
}

GamePage.propTypes = {};

export default GamePage;
