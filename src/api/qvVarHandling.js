import _ from 'lodash';
import { getQlikVariables, getApplicationNames } from './serverapi';

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export const filterVars = function(varData, searchText, groupSelected, hideLocked = false) {
	//-------------------
	//- varData :
	//- searchText :
	//- groupSelected :
	//- hideLocked : filter out any field that is marked as locked.
	//-------------------

	//Handle groupSelected Change
	//Filter passed varListView so only passed "groupSelected" shows
	//or if "All" is passed, show all variables
	let filteredVarData = varData.filter((value) => {
			if (value.group === groupSelected || groupSelected === 'All') {
				return true;
			} else {
				return false;
			}
	});

	//Handle hideLocked flag
	if (hideLocked) {
		filteredVarData = filteredVarData.filter(item => !item.locked);
	}
	//Handle search string searching
	if (searchText.length > 0) {
		//This function makes sure that any regex special chars are escaped.
		//No longer used -- using lodash function instead
		// const escapeRegExp = (str) => {
		// 	return str.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		// }
		//convert input string to a regular expression object to pass to match function
		let reSearchString = new RegExp(_.escapeRegExp(searchText.toLowerCase()), "g");
		filteredVarData = filteredVarData.filter(function(item){
			if (item.name) {
				return item.name.toLowerCase().match(reSearchString);
			}
		});
	}

	return filteredVarData;
};

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export const createGroupList = function (varData) {
	//Create "All" element so that we have a way to show all variables
	var allElement = {group: "All"};
	varData.unshift(allElement); //unshift (add as first element in array) "All" on to object array

	//array.filter will call this to return distinct group names from varData array
	var makeDistinct = function(value, idx, arr){
			if(idx > 0){
				if (value === arr[idx-1]) {
						return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
	};

	//Get a list of group names from varData (array of objects) and sort them
	//let groupList = Object.keys(varData).map(key => varData[key].group).sort();
	let groupList = varData.map(key => key.group).sort();

	//Make the groupList distinct
	let groupListDistinct = groupList.filter(makeDistinct);

	return groupListDistinct;
};

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export const getAllGroups = function () {
	const makeDistinct = function(value, idx, arr){
			if(idx > 0){
				if (value === arr[idx-1]) {
						return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
	};
	return getQlikVariables()
		.then(data => {
			//Get a list of group names from varData (array of objects) and sort them
			//let groupList = Object.keys(varData).map(key => varData[key].group).sort();
			let groupList = data.map(key => key.group).sort();
			//console.log('getqlikvars-grouplist', groupList);
			//Make the groupList distinct
			let allGroupsDistinct = groupList.filter(makeDistinct);
			//console.log('getqlikvarsdistinct', allGroupsDistinct);
			return allGroupsDistinct;
		});
	//array.filter will call this to return distinct group names from varData array

	// //Get a list of group names from varData (array of objects) and sort them
	// //let groupList = Object.keys(varData).map(key => varData[key].group).sort();
	// let groupList = allVars.map(key => key.group).sort();
	//
	// //Make the groupList distinct
	// let allGroupsDistinct = groupList.filter(makeDistinct);
	//
	// return allGroupsDistinct;
};
//This will check to see if the application name passed is being used by
//any variables in the qvVariables.json file
//return a promise, so must use .then()
//resolves to either true or false
export const applicationUsed = applicationName => {
	return getApplicationNames()
		.then(names => {
			console.log(names);
			return names.filter(name => name === applicationName).length>0 ? true : false;
		});
		//.then(names => console.log(names.filter(name => name === applicationName)));
	// return appNamesFound
	// 	.then(respose => response.length > 0 ? true : false);
};
