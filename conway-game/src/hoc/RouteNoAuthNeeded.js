import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import history from '../history';

export default (ComposedComponent) => {
	class NoAuthentication extends Component {
		componentWillMount() {
			if (this.props.authenticated) {
				history.push('/game');
			}
		}

		componentWillUpdate(nextProps) {
			if (nextProps.authenticated) {
				history.push('/game');
			}
		}

		PropTypes = {
			router: PropTypes.object
		};

		render() {
			return <ComposedComponent {...this.props} />;
		}
	}

	function mapStateToProps(state) {
		return { authenticated: state.auth.token !== null };
	}

	return connect(
		mapStateToProps,
		{}
	)(NoAuthentication);
};
