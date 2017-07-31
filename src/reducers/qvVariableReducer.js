import * as C from '../actions';

export const qvVariableReducer = (state = [], action) => {
	switch (action.type) {
		case C.LOAD_APPLICATION_VARS:
			return action.qvVariables;
		case C.UPDATE_APPLICATION_VAR:
			//find the index of the variable we need to update
			let workingVarIdx = state.findIndex(qvVar => qvVar.id === action.payload.id);
			//pull that variable out into its own JS Var.
			let workingVar = {...state.slice(workingVarIdx, workingVarIdx+1)[0]};
			return [
				...state.slice(0, workingVarIdx),
				action.payload,
				...state.slice(workingVarIdx+1)
			];
		case C.DELETE_APPLICATION_VAR:
			//only return variable objects that DON'T equal item we want deleted.
			let filteredState = state.filter(varObj => varObj.id !== action.payload);
			return filteredState
		default:
			return state;
	}
};
