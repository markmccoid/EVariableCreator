export default  {
	getCurrentDateString: () => {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		}

		if(mm<10) {
		    mm='0'+mm
		}

		return yyyy+'-'+mm+'-'+dd;
	},
	//-------------------------------------
	//-Gets current date, without any time component
	//-use .valueOf() to convert to number for comparisons
	//-Best not to use == if comparing objects
	//-------------------------------------
	getCurrentDateObject: () => {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		}

		if(mm<10) {
		    mm='0'+mm
		}

		return new Date(yyyy+'-'+mm+'-'+dd);
	},
	//Export the object
	exportData: (data) => {
		var jsonData = JSON.stringify(data);
		console.log(jsonData);
	},
	//
	//sort allowing you to pass in the property in object that you want to sort by.
	//Usage: someArray.sort((a,b) => objectSort(a,b,'sortField'))
	//Just use lodash's .sortBy functino
	objectSort: (a, b, sortField = "name") => {
	  if (a[sortField] > b[sortField]) {
	    return 1;
	  }
	  if (a[sortField] < b[sortField]) {
	    return -1;
	  }
	  // a must be equal to b
	  return 0;
	}
}
