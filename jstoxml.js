const fs = require('fs');
const path = require('path');
const X2JS = require('x2js');

const x2js = new X2JS();
const DATA_FILE = path.join(__dirname, 'qvvariables.json');

const exportToXML = (jsObj, outFileName)  => {
const xmlString = x2js.js2xml(jsObj);

	// //write the variables array back to disk
	// fs.writeFile(path.join(__dirname, outFileName), xmlString, () => {
	// 	console.log(`file written: ${outFileName}`);
	// });
	return xmlString;
};

module.exports = {
	exportToXML
};
