var xml = require('./jstoxml');
var testData = {
     MyRoot : {
                test: 'success',
                test2 : {
                    item : [ 'val1', 'val2' ]
                }
      }
};
xml.exportToXML(testData, 'myTestxml.xml');
