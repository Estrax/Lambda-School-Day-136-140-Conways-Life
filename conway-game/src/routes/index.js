import React from 'react';
import { Router, Route } from 'react-router-dom';

// import { RouteAuthNeeded, RouteNoAuthNeeded } from '../hoc';
import { HomePage } from '../pages';

const Routes = (props) => {
	return (
		<Router history={props.history}>
			<Route exact path='/' component={HomePage} />
		</Router>
	);
};

export default Routes;
