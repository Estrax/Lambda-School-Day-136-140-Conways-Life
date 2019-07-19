import React from 'react';
import PropTypes from 'prop-types';
import { Game } from '../components';

class GamePage extends React.Component {
	render() {
		return (
			<>
				<Game />
			</>
		);
	}
}

GamePage.propTypes = {};

export default GamePage;
