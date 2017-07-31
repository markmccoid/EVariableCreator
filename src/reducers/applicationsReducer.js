import * as C from '../actions';

export const applicationsReducer = (state = [], action) => {
	switch (action.type) {
		case C.LOAD_APPLICATION_LIST:
			return {
				applicationList: action.payload,
				selectedApplication: state.selectedApplication
			};
		case C.LOAD_APPLICATION_VARS:
			return {
				applicationList: state.applicationList,
				selectedApplication: action.appName
			};
		default:
			return state;
	}
};
