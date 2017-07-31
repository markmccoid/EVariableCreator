import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { store } from 'react-redux';

import Main from 'Main';
import MainDisplay from 'MainDisplay';
import Login from 'Login';
import { loadApplicationVariables } from './actions';
import AddQVVarContainer from './components/addVariable/AddQVVarContainer';
import ExportContainer from './components/export/ExportContainer';
import SettingsContainer from './components/settings/SettingsContainer';

//--React Router middleware below.
//--Can use these functions to check if a user is logged in and only take him to specified route if logged in.
//--To use the below you will need to do the following on a Route
//--  		<Route path="main" component={MainDisplay} onEnter={requireLogin}/>
//----------------------
// var requireLogin = (nextState, replace, next) => {
// 	if (!firebase.auth().currentUser) {
// 		replace('/');
// 	}
// 	next();
// };
// var redirectIfLoggedIn = (nextState, replace, next) => {
// 	if (firebase.auth().currentUser) {
// 		replace('/main');
// 	}
// 	next();
// };
//---------------------
//--The other option for restricting access to components is to use the componentWillMount lifecycle
//--function, with the authorization info pulled from the redux store
	// componentWillMount() {
	// 	//This will make sure that only users who are logged in will be able to access this component.
	// 	this.props.authStatus === AUTH_LOGGED_IN ? null : hashHistory.push('/');
	// }

//--The route post/:id is a parameter route.  This means that
//--react-router will push whatever is send after post/... into
//--the props of the component under:
//-- this.props.params.id

export default (
	<Route path="/" component={Main}>
		<IndexRoute component={MainDisplay}/>

		<Route path="addqvvar" component={AddQVVarContainer} />
		<Route path="settings" component={SettingsContainer} />
		<Route path="export" component={ExportContainer} />
	</Route>
);
