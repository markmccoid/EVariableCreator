import React from 'react';
import { getApplicationNames } from '../../api';
import ExportXML from './ExportXML';

class ExportContainer extends React.Component {
	state = {
		applicationNames: []
	}
	componentDidMount() {
		getApplicationNames()
			.then((data) => {
				this.setState({applicationNames: data});
			});
	}
	render() {

			return (
			<div className="row">
				<div className="columns callout secondary" style={{margin:"0 15px"}}>
					Export XML
					{this.state.applicationNames.map((appName) => {
						return <ExportXML key={appName} appName={appName} />
						})
					}

				</div>
			</div>
		);
	}
}

export default ExportContainer;

//
// <a id='tfa_src_data'>Export</a>
//
// document.getElementById('tfa_src_data').onclick = function() {
//                         var csv = JSON.stringify(localStorage['savedCoords']);
//                         var csvData = 'data:application/csv;charset=utf-8,'
//                                        + encodeURIComponent(csv);
//                         this.href = csvData;
//                         this.target = '_blank';
//                         this.download = 'filename.txt';
//                     };
