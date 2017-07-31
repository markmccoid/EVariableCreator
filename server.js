const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
const _ = require('lodash');
const app = express();
const X2JS = require('x2js'); //npm module to convert js object to XML

const DATA_FILE = path.join(__dirname, 'qvvariables.json');
const APPNAME_DATA = path.join(__dirname, 'appnames.json');


app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//---------------------------------------------------
//--A get to api/variables will return the qvvariables.json
//--file as a javascript object.
//---------------------------------------------------
app.get('/api/variables', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    //Looks like .send without the JSON.parse does the same as res.json(...)
    //res.send(data);
    res.json(JSON.parse(data));
  });
});

//---------------------------------------------------
//--A GET to api/variables/app will return an
//--array containing a unique list of applications
//--contained in the qvvariables.json file
//---------------------------------------------------
app.get('/api/variables/app', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
  	let qvVars = JSON.parse(data);
  	//pull out the application into an array, then use lodash to grab uniques and sort it.
  	let applicationList = _(qvVars.map(varObj => varObj.application)).uniq().sortBy();
    res.setHeader('Cache-Control', 'no-cache');
    //Looks like .send without the JSON.parse does the same as res.json(...)
    //res.send(data);
    res.send(applicationList);
  });
});

//---------------------------------------------------
//--A GET to api/variables/:application will return an
//--array containing only the qvvariable objects for that
//--specific application as a javascript object.
//--Also expecting a querystring/url-encoded data
//--"?format=xml" OR "?format=json" default is json.
//--If format is xml, then file will also be written to server
//---------------------------------------------------
app.get('/api/variables/app/:appName', (req, res) => {

  fs.readFile(DATA_FILE, (err, data) => {
    let qvVars = JSON.parse(data); //convert json to js object
    let appName = req.params.appName.toLowerCase(); //get querystring if available
		let appNameSansSpaces = appName.replace(/\s+/g, '');
    let applicationVars = qvVars.filter(qvVar => qvVar.application.toLowerCase() === appName);
		//If requesting XML, get XML Data.
		if (req.query.format === 'xml') {
			const x2js = new X2JS();
			let xmlString = x2js.js2xml({variable: applicationVars});
      //Enclose xml created with the appName, otherwise Qlik won't recognize properly
			applicationVars = `<${appNameSansSpaces}>${xmlString}</${appNameSansSpaces}>`;
			//write the variables array back to the server disk navigating to the include directory
      console.log(path.join(__dirname, '../Spreadsheets/',`${appName}.xml`));
			fs.writeFile(path.join(__dirname, '../Spreadsheets/',`${appName}.xml`), applicationVars, (err) => {
				if (err) {
					console.log(`Error Writing: ${appName}.xml`, err)
				} else {
					console.log(`file written: ${appName}.xml`);
				}
			});
		}
    res.setHeader('Cache-Control', 'no-cache');
    res.send(applicationVars);
  });
});


//---------------------------------------------------
//--A POST to api/variables will cause the object sent
//--to be added to the qvvariables.json file.
//--A new object with just the application that the
//--variable was added to will be returned
//---------------------------------------------------
app.post('/api/variables', (req, res) => {
	//If we send an JS object to a post, req.body will have the object in it.
  fs.readFile(DATA_FILE, (err, data) => {
    const variables = JSON.parse(data);

    const newVar = {
			id: uuid.v4(),
			application: req.body.application,
			name: req.body.name,
			expression: req.body.expression,
			description: req.body.description,
			notes: req.body.notes || '',
			group: req.body.group,
			locked: req.body.locked,
			createDate: req.body.createDate,
			modifyDate: '',
			createUser: req.body.createUser,
      modifyUser: ''
		};

		//--add this new variable object too the variables array
    variables.push(newVar);
		console.log('newvar', newVar);
    //write the variables array back to disk
    fs.writeFile(DATA_FILE, JSON.stringify(variables), () => {
    	let applicationVars = variables.filter(qvVar => qvVar.application.toLowerCase() === req.body.application.toLowerCase());
      res.setHeader('Cache-Control', 'no-cache');
      //return the variables file so application can update it's
      res.json(applicationVars);
    });
  });
});

//---------------------------------------------------
//--A PUT to api/variables will cause the object sent
//--to be updated in the qvvariables.json file.
//--an empty object {} will be returned
//---------------------------------------------------
/**
 * @api {put} /api/variables update a single variable object
 * @apiName UpdateVariable
 * @apiGroup Variables
 *
 * @apiParam {Object} QVVariableObject QV Variable Object.
 *
 * @apiSuccess {Object} emptyObject An Empty Object.
 */
app.put('/api/variables', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const variables = JSON.parse(data);
    //Find the variable to be updated
    variables.forEach(qvVar => {
    	if (qvVar.id === req.body.id) {
				qvVar.application = req.body.application;
				qvVar.name = req.body.name;
				qvVar.expression = req.body.expression;
				qvVar.description = req.body.description;
				qvVar.notes = req.body.notes;
				qvVar.group = req.body.group;
				qvVar.locked = req.body.locked;
				qvVar.modifyDate = req.body.modifyDate,
        qvVar.modifyUser = req.body.modifyUser;
    	}
    });
    //write the variables array back to disk
    fs.writeFile(DATA_FILE, JSON.stringify(variables), () => {
      res.setHeader('Cache-Control', 'no-cache');
      //return the variables file so application can update it's
      res.json({});
      res.end();
    });
  });
});

//---------------------------------------------------
//--A DELETE to api/variables will cause the object with
//--the id sent to be deleted
//--an empty object {} will be returned
//---------------------------------------------------
app.delete('/api/variables/:id', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const variables = JSON.parse(data);
    //Filter and remove the variable to be deleted
    const varDeleted = variables.filter(qvVar => qvVar.id !== req.params.id);
    //write the variables array back to disk
    fs.writeFile(DATA_FILE, JSON.stringify(varDeleted), () => {
      res.setHeader('Cache-Control', 'no-cache');
      //return the variables file so application can update it's
      res.json({});
      res.end();
    });
  });
});

//==========================================================
//--API info for /api/settings/...
//==========================================================
//---------------------------------------------------
//--A get to api/variables will return the applications.json
//--file as a javascript object.
//---------------------------------------------------
app.get('/api/settings/appnames', (req, res) => {
	fs.readFile(APPNAME_DATA, (err, data) => {
		const appnames = JSON.parse(data);
		res.setHeader('Cache-Control', 'no-cache');
		res.send(appnames);
	});
});
//---------------------------------------------------
//--A POST to api/settings/appnames will cause the object sent
//--to be added to the appnames.json file.
//--A new object of all appnames will be returned
//---------------------------------------------------
app.post('/api/settings/appnames', (req, res) => {
	//If we send an JS object to a post, req.body will have the object in it.
  let newAppName = req.body.appName;
  fs.readFile(APPNAME_DATA, (err, data) => {
    const appnames = JSON.parse(data);
    //Check to make sure new name doesn't already exist
    //Filtering and then checking the length of array return and converting to a boolean
		const dupAppName = appnames.filter(name => name.appName === newAppName).length > 0;
    if (dupAppName) {
      res.setHeader('Cache-Control', 'no-cache');
      //return the variables file so application can update it's
      res.json({
					response: appnames,
					error: 'Duplicate Application Name'
				});
      return;
    }
    const newAppNameObj = {
			id: uuid.v4(),
			appName: req.body.appName
		};
		//--add this new variable object too the variables array
    appnames.push(newAppNameObj);
    //write the variables array back to disk
    fs.writeFile(APPNAME_DATA, JSON.stringify(appnames), () => {
      res.setHeader('Cache-Control', 'no-cache');
      //return the variables file so application can update it's
      res.json(appnames);
    });
  });
});

//---------------------------------------------------
//--A PUT to api/settings/appnames will cause the object sent
//--to be updated in the appnames.json file.
//--an empty object {} will be returned
//---------------------------------------------------
app.put('/api/settings/appnames', (req, res) => {
  fs.readFile(APPNAME_DATA, (err, data) => {
    const appnames = JSON.parse(data);
    //Get the old appName that we will be updating
    const oldAppName = appnames.filter(appname => appname.id === req.body.id)[0].appName;
    console.log(oldAppName);
    //Find the appname to be updated
    appnames.forEach(app => {
    	if (app.id === req.body.id) {
				app.appName = req.body.appName;
    	}
    });
    //Now read the qvVariables.json file and change all the application names
    //the match the oldAppName to the new appName
    fs.readFile(DATA_FILE, (err, data) =>{
      const variables = JSON.parse(data);
      const newVariablesArray = _.forEach(variables, variable => {
        if (variable.application === oldAppName) {
          variable.application = req.body.appName;
        }
      });
      fs.writeFile(DATA_FILE, JSON.stringify(newVariablesArray), (err)=> {
        if (err) {
          console.log(`error writing file - ${DATA_FILE} - in PUT api/seeting/appnames`)
        }
      });
    });
    //write the appnames array back to disk
    fs.writeFile(APPNAME_DATA, JSON.stringify(appnames), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json({});
      res.end();
    });
  });
});

//---------------------------------------------------
//--A DELETE to api/variables will cause the object with
//--the id sent to be deleted
//--an empty object {} will be returned
//---------------------------------------------------
app.delete('/api/settings/appnames/:id', (req, res) => {
  const appNamesFile = JSON.parse(fs.readFileSync(APPNAME_DATA));
  //Get the appName to delete since we are only getting the id
  console.log(req.params.id);

  const newAppNames = appNamesFile.filter(obj => obj.id !== req.params.id);
  fs.writeFile(APPNAME_DATA, JSON.stringify(newAppNames), (err) => {
    if (err) {
      console.log(`Error deleting ${req.params.id} from appnames.json`);
    } else {
      res.setHeader('Cache-Control', 'no-cache');
      res.json({});
      res.end();
    }
  })
//The chunk below can be used if we want to delete stuff from the qvVariables.json file too
//  appNameToDelete = appNamesFile.filter(obj => obj.id === req.params.id)[0].appName;
  // fs.readFile(DATA_FILE, (err, data) => {
  //   const variables = JSON.parse(data);
  //   //Find out if any variables have the appName to be deleted as the application property
  //   const varsToKeep = variables.filter(qvVar => qvVar.application !== appNameToDelete);
  //   //write the variables array back to disk
  //   fs.writeFile(DATA_FILE, JSON.stringify(varsToKeep), (err) => {
  //     res.setHeader('Cache-Control', 'no-cache');
  //     //return the variables file so application can update it's
  //     res.json({});
  //     res.end();
  //   });
  // });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
