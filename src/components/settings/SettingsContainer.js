import React from 'react';
import { connect } from 'react-redux';

import { loadApplicationVariables } from '../../actions';
import ManageApplicationsContainer from './ManageApplicationsContainer';
import SetUser from './SetUser';

class SettingsContainer extends React.Component {
	state = {
		editState: ''
	};

	componentDidMount () {
		//When component mounts, clear out the Application Variable state
		//This will clear out the qvVariables, applications and appState redux store nodes
		this.props.dispatch(loadApplicationVariables('', ''));
	}
	render () {
		//function to check the editState (component state) to
		//determine which component to show.
		const renderEditScreen = () => {
			const { editState } = this.state;
				switch (editState) {
					case 'app':
						return <ManageApplicationsContainer />
					case 'user':
						return <SetUser />
					default:
						return <div></div>
				}
		};

		return (
		<div className="row">
			<div className="columns callout secondary small-2"
						style={{padding: "5px 0", marginLeft: "15px", marginBottom:"0px"}}>
				<h4 className="text-center">Settings</h4>
				<ul className="menu vertical">
					<li style={{display: 'inline-block', width:'100%'}}>
						<a onClick={() => this.setState({editState: 'app'})}>Application Names </a>
					</li>
					<li style={{display: 'inline-block', width:'100%'}}>
						<a onClick={() => this.setState({editState: 'user'})}>Set User </a>
					</li>
				</ul>
			</div>
			<div className="columns callout secondary" style={{marginLeft: "-1px", marginRight: "15px", marginBottom:"0px"}}>
					{renderEditScreen()}
			</div>
		</div>
		);
	}
}


export default connect()(SettingsContainer);
