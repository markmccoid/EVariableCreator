import * as api from '../api';

//Initialization Actions
//export const INITIALIZE_STORE = 'INITIALIZE_STORE';

//Loading Application List
export const LOAD_APPLICATION_LIST = 'LOAD_APPLICATION_LIST';


//-----------------------------------------------
export const loadApplicationList = (appList) => {
	return {
		type: LOAD_APPLICATION_LIST,
		payload: appList
	}
};

export const startLoadApplicationList = () => {
	return dispatch => {
		//Get list of Applications in the QVVariables.json file on server
		var request = api.getApplicationNames();
			request.then(data => {
				dispatch(loadApplicationList(data));
			});
	};
};
