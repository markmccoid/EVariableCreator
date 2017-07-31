import * as api from '../api';

//QV Variable Actions
export const LOAD_APPLICATION_VARS = 'LOAD_APPLICATION_VARS';
export const UPDATE_APPLICATION_VAR = 'UPDATE_APPLICATION_VAR';
export const DELETE_APPLICATION_VAR = 'DELETE_APPLICATION_VAR';

//-----------------------------------------------
//--QV Variable Actions ------------
//-----------------------------------------------
export const loadApplicationVariables = (qvVariables, appName) => {
	return {
			type: LOAD_APPLICATION_VARS,
			qvVariables,
			appName
		};
};

export const startLoadApplicationVars = (appName) => {
	return dispatch => {
		var request = api.getApplicationVariables(appName);
		return request.then(qvVariables => {
			dispatch(loadApplicationVariables(qvVariables, appName));
		});
	};
};

//--Update Application varaible --- Updates a single variable in the currently
//--loaded "application" variable list
export const updateApplicationVar = qvVarObj => {
	return {
		type: UPDATE_APPLICATION_VAR,
		payload: qvVarObj
	};
};

export const startUpdateApplicationVar = qvVarObj => {
	return dispatch => {
		return api.updateQlikVariable(qvVarObj)
			.then(response => {
				dispatch(updateApplicationVar(qvVarObj));
			});
	};
};
//----END Update Application Var ----

//--Delete Application varaible -- Deletes a single variable in the currently
//--loaded "application" variable list
export const deleteApplicationVar = qvVarId => {
	return {
		type: DELETE_APPLICATION_VAR,
		payload: qvVarId
	};
};

export const startDeleteApplicationVar = qvVarId => {
	return dispatch => {
		return api.deleteQlikVariable(qvVarId)
			.then(response => {
				dispatch(deleteApplicationVar(qvVarId));
			});
	};
};
//----END Delete Application Var ----
