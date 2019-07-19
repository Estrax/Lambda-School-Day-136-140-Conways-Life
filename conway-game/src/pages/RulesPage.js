import React from 'react';
import PropTypes from 'prop-types';

class RulesPage extends React.Component {
	render() {
		return (
			<div className='rules'>
				<h1 className='title text-center'>Rules</h1>
				<p>
					In the game of life, each cell can have one out of multiple
					states available - there, it can be alive or dead.
					<br />
					<br />
					Alive cells remain alive as long as they have at least{' '}
					<b>two</b> neighbors. The cell will die due to loneliness
					when it has less neighbors.
					<br />
					<br />
					At the same time, if a cell has <b>more than three</b>{' '}
					neighbors, it is also going to die due to the "social
					burnout". However, the dead cell that is surrounded by{' '}
					<b>three</b> neighbors is coming back to life.
					<br />
					<br />
				</p>
			</div>
		);
	}
}

RulesPage.propTypes = {};

export default RulesPage;
