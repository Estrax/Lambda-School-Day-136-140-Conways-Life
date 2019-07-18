import React from 'react';
import { Router, Route } from 'react-router-dom';
import { Navbar } from '../containers';

import { RouteAuthNeeded, RouteNoAuthNeeded } from '../hoc';
import {
	HomePage,
	LoginPage,
	RegisterPage,
	GamePage,
	AboutPage,
	RulesPage
} from '../pages';

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
			<Route exact path='/about' component={RouteAuthNeeded(AboutPage)} />
			<Route exact path='/rules' component={RouteAuthNeeded(RulesPage)} />
		</Router>
	);
};

export default Routes;
