//AppState Actions
export const UPDATE_GROUP_VALUE = 'UPDATE_GROUP_VALUE';
export const UPDATE_SELECTED_VAR = 'UPDATE_SELECTED_VAR'
export const UPDATE_EDIT_STATE = 'UPDATE_EDIT_STATE';
export const UPDATE_SEARCH_TEXT = 'UPDATE_SEARCH_TEXT';
export const UPDATE_HIDE_LOCKED = 'UPDATE_HIDE_LOCKED';
export const UPDATE_USER = 'UPDATE_USER';

//AppState Actions
export const updateSelectedGroup = selectedGroup => {
	//If selectedGroup is blank, the reset group to All
	if (selectedGroup === '') {
		selectedGroup = 'All';
	}
	return {
		type: UPDATE_GROUP_VALUE,
		selectedGroup
	};
};

export const updateSelectedVariable = qvVarId => {
	return {
		type: UPDATE_SELECTED_VAR,
		payload: qvVarId
	};
};

export const updateEditState = qvVarId => {
	return {
		type: UPDATE_EDIT_STATE,
		payload: qvVarId
	};
};

export const updateSearchText = text => {
	return {
		type: UPDATE_SEARCH_TEXT,
		payload: text
	};
};

export const updateHideLocked = flag => {
	return {
		type: UPDATE_HIDE_LOCKED,
		payload: flag
	};
};

export const updateUser = user => {
	return {
		type: UPDATE_USER,
		payload: user
	};
};
