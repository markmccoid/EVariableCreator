import * as C from '../actions';

export var authReducer = (state = {}, action) => {
	switch (action.type) {
		case C.LOGIN:
			return { ...state, uid: action.uid, status: AUTH_LOGGED_IN };
		case C.LOGOUT:
			return { ...state, uid: undefined, status: AUTH_LOGGED_OUT};
		case C.AUTH_LOGGED_OUT:
			return { ...state, status: AUTH_LOGGED_OUT};
		case C.AUTH_LOGGED_IN:
			return { ...state, status: AUTH_LOGGED_IN};
		case C.AUTH_ERROR:
			return { ...state, status: AUTH_ERROR, errorMessage: action.errorMessage};
		case C.AUTH_WORKING:
			return { ...state, status: AUTH_WORKING};
		default:
			return state;
	}
};
