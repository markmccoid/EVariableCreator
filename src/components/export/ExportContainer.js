import React from 'react';
import { getApplicationNames } from '../../api';
import ExportXML from './ExportXML';
import styled from 'styled-components';

//----Styled Components --------------------//
const Row = styled.div`
	display: flex;
	flex-direction: row;
`;

const Sidebar = styled.div`
	width: 200px;
`;

const MainContent = styled.div`
	width: 100%;
	margin: 0 !important;
`;
//----------------------------------------

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
			<Row>
				<div className="columns callout secondary" >
					Export XML
					{this.state.applicationNames.map((appName) => {
						return <ExportXML key={appName} appName={appName} />
						})
					}

				</div>
			</Row>
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
