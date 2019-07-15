import React from 'react';
import { Router, Route } from 'react-router-dom';
import { Navbar } from '../containers';

import { RouteAuthNeeded, RouteNoAuthNeeded } from '../hoc';
import { HomePage, LoginPage, RegisterPage, GamePage } from '../pages';

const Routes = (props) => {
	return (
		<Router history={props.history}>
			<Navbar />
			<Route exact path='/' component={RouteNoAuthNeeded(HomePage)} />
			<Route
				exact
				path='/login'
				component={RouteNoAuthNeeded(LoginPage)}
			/>
			<Route
				exact
				path='/register'
				component={RouteNoAuthNeeded(RegisterPage)}
			/>
			<Route exact path='/game' component={RouteAuthNeeded(GamePage)} />
		</Router>
	);
};

export default Routes;
