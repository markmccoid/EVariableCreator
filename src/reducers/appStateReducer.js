import * as C from '../actions';

export const appStateReducer = (state = [], action) => {
	switch (action.type) {
		case C.UPDATE_GROUP_VALUE:
		//When updating a group value, there are certain appState items that should
		//be reset, like clearing any "selectedVariableId", setting editing to false
		//and clearing any search.  We do leave the hideLocked flag set to whatever was set.
			return {
					...state,
					selectedGroup: action.selectedGroup,
					selectedVariableId: null,
					editing: false,
					searchText: ''
			};
		case C.UPDATE_SELECTED_VAR:
			return {
				...state,
				selectedVariableId: action.payload
			};
		case C.UPDATE_EDIT_STATE:
			let editState = true;
			if (!action.payload) {
				editState = false;
			}
			return {
				...state,
				selectedVariableId: action.payload,
				editing: editState
			}
		//--when loading new application variables,
		//--clear out the selectedGroup, selectedVariableId & set editing flag to false
		case C.LOAD_APPLICATION_VARS:
			return {
				...state,
				selectedGroup: '',
				selectedVariableId: null,
				editing: false,
				searchText: '',
				hideLocked: false
			};

		case C.UPDATE_SEARCH_TEXT:
			return {
				...state,
				searchText: action.payload
			};
		case C.UPDATE_HIDE_LOCKED:
			return {
				...state,
				hideLocked: action.payload
			};
		case C.UPDATE_USER:
			return {
				...state,
				user: action.payload
			}
		default:
			return state;
	}
};
