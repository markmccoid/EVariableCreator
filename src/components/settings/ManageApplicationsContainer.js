import React from 'react';

import { getApplicationData, updateAppName, applicationUsed, deleteAppName } from '../../api';
import AppRowView from './AppRowView';
import AppEditView from './AppEditView';

class ManageApplicationsContainer extends React.Component {
	state = {
		applications: [],
		editingAppId: null
	}

	handleEditApplication = (appId) => {
		this.setState({editingAppId: appId});
	}

	handleSaveApplication = (appName, appId) => {
		const appToUpdate = {
			id: appId,
			appName
		};
		updateAppName(appToUpdate)
			.then(resp => getApplicationData()
				.then(data => {
						this.setState({applications: data, editingAppId: null});
					}
				));
	}

  handleDeleteApplication = (appName, appId) => {
		//Call qvVarHandling routine to check to see if the application is used in any variables
		applicationUsed(appName)
			.then(resp => {
				if (resp) {
					alert(`Application Name ${appName} exists in qvVariables.json file.  Nothing will be deleted`);
				} else {
					//If not used, simply delete appname from the appnames.json file
					deleteAppName(appId)
						.then(resp => {
							getApplicationData()
								.then(data => {
										this.setState({applications: data, editingAppId: null});
										alert(`Application ${appName} was deleted`);
									}
								);
						});
				}
			});
  }
	renderAppView() {
		return this.state.applications.map(app => {
				return (
					<AppRowView
						key={app.id}
						application={app}
						onEditApplication={this.handleEditApplication}
						onSaveApplication={this.handleSaveApplication}
						onDeleteApplication={this.handleDeleteApplication}
						isEditing={app.id === this.state.editingAppId}
					/>
				);
			});
	}
	componentDidMount() {
	//Call function that will return a list of application objects
	//and store in component state
		getApplicationData().then(data => this.setState({applications: data}));
		console.log('MAC-CDM', this.state.applications);
	}

	render() {
		const { applications } = this.state;
		console.log(applications);
		return (
			<div>
				<div style={{borderBottom: "1px solid #bbbbbb"}}>
					{this.renderAppView()}
				</div>
			</div>
		);
	}
}

export default ManageApplicationsContainer;
