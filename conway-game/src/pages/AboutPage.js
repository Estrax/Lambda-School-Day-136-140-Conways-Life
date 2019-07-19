import React from 'react';
import PropTypes from 'prop-types';

class AboutPage extends React.Component {
	render() {
		return (
			<div className='about'>
				<h1 className='title text-center'>About</h1>
				<p>
					<b>The Game of Life</b>, also known simply as <b>Life</b>,
					is a cellular automaton devised by the British mathematician
					John Horton Conway in 1970. A cellular automaton consists of
					a regular grid of cells, each in one of a finite number of
					states, such as on and off (in contrast to a coupled map
					lattice). The grid can be in any finite number of dimensions
					- this version utilizes 2-dimensional data. For each cell, a
					set of cells called its neighborhood is defined relative to
					the specified cell. An initial state (time t = 0) is
					selected by assigning a state for each cell. A new
					generation is created (advancing t by 1), according to some
					fixed rule (generally, a mathematical function) that
					determines the new state of each cell in terms of the
					current state of the cell and the states of the cells in its
					neighborhood. Typically, the rule for updating the state of
					cells is the same for each cell and does not change over
					time, and is applied to the whole grid simultaneously,
					though exceptions are known, such as the stochastic cellular
					automaton and asynchronous cellular automaton.
					<br />
					<br />
					The point of this game is to place a set of starter cells
					(aka population samples) and watch them evolving based on
					the set of rules.
					<br />
					<br />
				</p>
			</div>
		);
	}
}

AboutPage.propTypes = {};

export default AboutPage;
