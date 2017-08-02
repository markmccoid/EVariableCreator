import axios from 'axios';
import _ from 'lodash';
const nfa = window.require('../app/nativeFileAccess');

export const getQlikVariables = () => {
	//Get the variables.json file contents from the server
		return nfa.getQlikVariables()
			.then(response => response);
};

//Add a Qlik variable to the qvVariables.json file on the server
export const addQlikVariable = varToAdd => {
		return nfa.addQlikVariable(varToAdd)
			.then(response => {
				console.log(response);
		  })
		  .catch(error => {
				console.log(error);
		  });
};

//Returns a unique list of application names that are in the qvVariables.json file.
export const getApplicationNames = () => {
		return nfa.getApplicationNames()
			.then(applicationList => applicationList);
};

//Returns a javascript object of the variables for the passed appName (application)
export const getApplicationVariables = appName => {
		return nfa.getApplicationVariables(appName)
			.then(applicationVars => applicationVars);
};

//Returns XML for the variables for the passed appName (application)
export const getXMLApplicationVariables = appName => {
		return nfa.getXMLData(appName)
			.then(response => response);
};

//Update the qvVariables.json file with the data in varToUpdate.
export const updateQlikVariable = varToUpdate => {
		return nfa.updateQlikVariable(varToUpdate)
			.then(response => {
				if (response === 200) {
					return 'Variable updated Successfully';
				}
				return response;
			})
			.catch(error => {
				console.log(`Error updating Qlik Variable id: ${varToUpdate.id} - ${error}`);
			})
};

//Delete the Qlik varaible from the qvVariables.json file with the passed id.
export const deleteQlikVariable = idToDelete => {
		return nfa.deleteQlikVariable(idToDelete)
			.then(response => {
				console.log('QV Variable Deleted');
			})
			.catch(error => {
				console.log(`Error deleting Qlik Variable id: ${idToDelete} - ${error}`);
			});
};

//==========================================
//-Pull from the /api/settings/... routes
//==========================================
//--Get the data from the applications.json file.
export const getApplicationData = () => {
	return nfa.getApplicationData()
		.then(resp => _.sortBy(resp, ['appName']))
		.catch(error => console.log('Error in getApplicationData--', error));
}

//Add a new appname to the appNames.json file
export const addAppName = AppNameToAdd => {
		return nfa.addAppName(AppNameToAdd)
			.then(response => {
					return response
		  })
		  .catch(error => {
				console.log(`serverApi:getApplicationData ERROR -${error}`);
		  });
};

//Update the an individual app in the appnames.json file with the data passed in
export const updateAppName = appToUpdate => {
		return nfa.updateAppName(appToUpdate)
			.then(response => {
				console.log(response)
				if (response.status === 200) {
					return 'AppName updated Successfully';
				}
				return response;
			})
			.catch(error => {
				console.log(`Error updating appName id: ${appToUpdate.id} - ${error}`);
			})
};

//Delete the application name from the appnames.json file with the passed id.
export const deleteAppName = idToDelete => {
		return nfa.deleteAppName(idToDelete)
			.then(response => {
				console.log(`AppName Deleted`);
			})
			.catch(error => {
				console.log(`Error deleting AppName id: ${idToDelete} - ${error}`);
			});
};
