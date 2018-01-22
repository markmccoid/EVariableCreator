//functions to access data from main electron thread
//to be used with ipc/remote communication
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const uuid = require('uuid');
const X2JS = require('x2js'); //npm module to convert js object to XML
const { remote } = require('electron');

// make promise version of fs.readFile()
const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};
// make promise version of fs.writeFile()
const writeFilePromise = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if (err)
        reject(err);
      else
        resolve();
    });
  });
};
//Can't access the remote.app. feature except from within a function.  Probably after app has loaded.
//passed either a constant with filename.ext, will return the path, relative to where the application EXE
//is located.
const getLocalFile = (dataFile) => {
  if (process.env.NODE_ENV === 'development') {
    return path.join(remote.app.getAppPath(), '/data', dataFile);
  }
  return path.join(path.dirname(remote.app.getPath('exe')), '/data', dataFile);
};
const VAR_FILE = 'qvvariables.json';
const APPNAMES_FILE = 'appnames.json';

//-----------------------------
//--will return an array containing a unique list
//-- of applications contained in the qvvariables.json file
//---------------------------------------------------
const getApplicationNames = () => {
  return readFilePromise(getLocalFile(VAR_FILE))
    .then(data => {
      let qvVars = JSON.parse(data);
      let applicationList = _.uniq(qvVars.map(varObj => varObj.application));
      applicationList = _.sortBy(applicationList);
      return applicationList;
    });
};

//------------------------------------------------
//--Will return the the whole qvvariables.json
//--file as a javascript object.
//---------------------------------------------------
const getQlikVariables = () => {
  return readFilePromise(getLocalFile(VAR_FILE))
    .then(data => {
      return JSON.parse(data);
    });
};

//---------------------------------------------------
//--will return an array containing only the qvvariable objects for
//--passed appName as a javascript object.
//---------------------------------------------------
const getApplicationVariables = (appName) => {
  return readFilePromise(getLocalFile(VAR_FILE))
    .then((data) => {
      let qvVars = JSON.parse(data); //convert json to js object
      appName = appName.toLowerCase(); //get querystring if available
      let applicationVars = qvVars.filter(qvVar => qvVar.application.toLowerCase() === appName);
      return applicationVars;
    });
};
//------------------------------------------------
//--Will update the varToAdd passed in the qvvariables.json
//--
//---------------------------------------------------
const addQlikVariable = (varToAdd) => {
  return readFilePromise(getLocalFile(VAR_FILE))
    .then((data) => {
      let variables = JSON.parse(data);
      const newVar = {
        id: uuid.v4(),
        application: varToAdd.application,
        name: varToAdd.name,
        expression: varToAdd.expression,
        description: varToAdd.description,
        notes: varToAdd.notes || '',
        group: varToAdd.group,
        locked: varToAdd.locked,
        createDate: varToAdd.createDate,
        modifyDate: '',
        createUser: varToAdd.createUser,
        modifyUser: ''
      };

      //--add this new variable object to the variables array
      variables.push(newVar);
      //write the variables array back to disk
      fs.writeFile(getLocalFile(VAR_FILE), JSON.stringify(variables), () => {
        //Filter so we return just the applications variables which was added to
        let applicationVars = variables.filter(qvVar => qvVar.application.toLowerCase() === varToAdd.application.toLowerCase());
        //return the variables file so application can update it's store
        return applicationVars;
      });
    });
};
//---------------------------------------------------
//--updateQlikVariable will cause the object sent in varToUpdate
//--to be updated in the qvvariables.json file.
//--an empty object {} will be returned
//---------------------------------------------------
const updateQlikVariable = varToUpdate => {
  return readFilePromise(getLocalFile(VAR_FILE))
    .then(data => {
      let variables = JSON.parse(data);
      //Find the variable to be updated and update it
      variables.forEach(qvVar => {
        if (qvVar.id === varToUpdate.id) {
          qvVar.application = varToUpdate.application;
          qvVar.name = varToUpdate.name;
          qvVar.expression = varToUpdate.expression;
          qvVar.description = varToUpdate.description;
          qvVar.notes = varToUpdate.notes;
          qvVar.group = varToUpdate.group;
          qvVar.locked = varToUpdate.locked;
          qvVar.modifyDate = varToUpdate.modifyDate,
          qvVar.modifyUser = varToUpdate.modifyUser;
        }
      });
      //write the variables array back to disk
      fs.writeFile(getLocalFile(VAR_FILE), JSON.stringify(variables), (err) => {
        if (err) {
          console.log('Error writing in updateQlikVariable', err);
          return;
        }
        console.log('updateQlikVariable: qvVariables.json written successfully');
        return {status: 200}
      });
    });
};

//---------------------------------------------------
//--The variable matching the idToDelete parameter will
//--be deleted
//--an empty object {} will be returned
//---------------------------------------------------
const deleteQlikVariable = idToDelete => {
  return readFilePromise(getLocalFile(VAR_FILE))
    .then(data => {
      let variables = JSON.parse(data);
      //Filter and remove the variable to be deleted
      const varDeleted = variables.filter(qvVar => qvVar.id !== idToDelete);
      //write the variables array back to disk
      fs.writeFile(getLocalFile(VAR_FILE), JSON.stringify(varDeleted), err => {
        if (err) {
          console.log('Error writing in deleteQlikVariable', err);
          return;
        }
        console.log('deleteQlikVariable: qvVariables.json written successfully');
        return { status: 200 };
      });
    });
};

//==========================================================
//--LOADING FROM APPNAMES.JSON
//==========================================================
//---------------------------------------------------
//--return the applications.json file as a javascript object.
//---------------------------------------------------
const getApplicationData = () => {
  return readFilePromise(getLocalFile(APPNAMES_FILE))
    .then(data => {
      return JSON.parse(data);
    });
};
//---------------------------------------------------
//--The object sent will be added to the appnames.json file.
//--A new object of all appnames will be returned
//---------------------------------------------------
const addAppName = appNameToAdd => {
  return readFilePromise(getLocalFile(APPNAMES_FILE))
    .then(data => {
      let appNames = JSON.parse(data);
      //Check to make sure new name doesn't already exist
      //Filtering and then checking the length of array return and converting to a boolean
      const dupAppName = appNames.filter(name => name.appName === appNameToAdd).length > 0;
      if (dupAppName) {
        //return the unchanged appNam
        return {
          response: appNames,
          error: 'Duplicate Application Name'
        };
      }
      const newAppNameObj = {
        id: uuid.v4(),
        appName: appNameToAdd
      };
      //--add this new variable object too the variables array
      appNames.push(newAppNameObj);
      //write the variables array back to disk
      return writeFilePromise(getLocalFile(APPNAMES_FILE), JSON.stringify(appNames))
        .then(() => {
          return appNames;
        });
    });
};
//---------------------------------------------------
//--find the appToUpdate.id in the appnames.json file.
//--and update it.
//--an empty object {} will be returned
//---------------------------------------------------
const updateAppName = appToUpdate => {
  return readFilePromise(getLocalFile(APPNAMES_FILE))
    .then(data => {
      let appNames = JSON.parse(data);
      //Get the old appName that we will be updating
      const oldAppName = appNames.filter(appname => appname.id === appToUpdate.id)[0].appName;
      //Find the appname to be updated
      appNames.forEach(app => {
        if (app.id === appToUpdate.id) {
          app.appName = appToUpdate.appName;
        }
      });
      //Now read the qvVariables.json file and change all the application names
      //the match the oldAppName to the new appName
      return readFilePromise(getLocalFile(VAR_FILE))
        .then(data => {
          let variables = JSON.parse(data);
          const newVariablesArray = _.forEach(variables, variable => {
            if (variable.application === oldAppName) {
              variable.application = appToUpdate.appName;
            }
          });
          return writeFilePromise(getLocalFile(VAR_FILE), JSON.stringify(newVariablesArray))
            .then(() => {
              return writeFilePromise(getLocalFile(APPNAMES_FILE), JSON.stringify(appNames))
                .then(data => {
                  return {status:200}
                });
            });
        });
    });
};

//---------------------------------------------------
//--The idToDelete sent will be deleted from the appnames.json file
//--an {status: 200} will be returned on success,
//--{status: 500, error: err} on an error
//---------------------------------------------------
const deleteAppName = idToDelete => {
  const appNamesFile = JSON.parse(fs.readFileSync(getLocalFile(APPNAMES_FILE)));
  //Get the appName to delete since we are only getting the id
  //const newAppNames = appNamesFile.filter(obj => obj.id !== idToDelete);
  const newAppNames = appNamesFile.filter(obj => obj.id !== idToDelete);
  return writeFilePromise(getLocalFile(APPNAMES_FILE), JSON.stringify(newAppNames))
    .then(data => {
      return {status: 200};
    })
    .catch(err => {
      return {status: 500, error: err};
    });
};

//Takes the appName and writes out an XML file of the groups data to the Spreadsheets directory
//returns the applicationGroups data
const getXMLData = appName => {
  return getApplicationVariables(appName)
    .then(applicationVars => {
      let appNameSansSpaces = appName.replace(/\s+/g, '').toLowerCase();
      const x2js = new X2JS();
      let xmlString = x2js.js2xml({variable: applicationVars});
      //Enclose xml created with the appName, otherwise Qlik won't recognize properly
      applicationVars = `<${appNameSansSpaces}>${xmlString}</${appNameSansSpaces}>`;
      //write the groups array back to the server disk navigating to the include directory
      let xmlFilePathName = process.env.NODE_ENV === 'development' ?
        path.join(remote.app.getAppPath(), '../Spreadsheets/', `${appName}.xml`)
        :
        path.join(path.dirname(remote.app.getPath('exe')), '../Spreadsheets/', `${appName}.xml`);
      fs.writeFile(xmlFilePathName, applicationVars, (err) => {
        if (err) console.log(`Error Writing: ${appName}.xml`, err)
        console.log(`file written: ${appName}.xml`);
      });
      return applicationVars;
    });
};

module.exports = {
  getApplicationNames,
  addQlikVariable,
  getQlikVariables,
  updateQlikVariable,
  deleteQlikVariable,
  getApplicationVariables,
  getApplicationData,
  addAppName,
  updateAppName,
  deleteAppName,
  getXMLData
}
