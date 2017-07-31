import React from 'react';
import { connect } from 'react-redux';

import QVAppList from './QVAppList';
import QVVarsDisplay from './QVVarsDisplay';
import * as api from '../api';
import { startLoadApplicationList } from '../actions';

class MainDisplay extends React.Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		//When component mounts, clear out the Application Variable state
		//This will clear out the qvVariables, applications and appState redux store nodes
		this.props.dispatch(startLoadApplicationList());
	}
	render() {
		return (
			<div className="row">
				<div className="columns callout secondary small-2"
							style={{padding: "5px 0", marginLeft: "15px", marginBottom:"0px"}}>
					<h5 className="text-center">Application List</h5>
					<ul className="menu vertical">
						<QVAppList
							applicationList={this.props.applications.applicationList}
							selectedApplication={this.props.applications.selectedApplication}
						/>
					</ul>
				</div>
				<div className="columns callout secondary" style={{marginLeft: "-1px", marginRight: "15px", marginBottom:"0px"}}>

					<QVVarsDisplay />
				</div>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		applications: state.applications
	}
};
export default connect(mapStateToProps)(MainDisplay);
