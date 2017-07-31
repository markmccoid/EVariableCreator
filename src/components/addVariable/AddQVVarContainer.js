import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getAllGroups,
				 createGroupList,
	 			 addQlikVariable,
				 getApplicationVariables,
				 getApplicationData,
				 addAppName } from '../../api';
import { loadApplicationVariables } from '../../actions';
import AddQVVarForm from './AddQVVarForm';


class AddQVVarContainer extends React.Component {
	state = {
		currApplication: '',
		newGroupName: '',
		applicationList: [],
		groupList: []
	};

//Handles the Save to Server of the new QV variable
	handleSaveToServer = (data) => {
		//data in an object with the fields the from AddQVVarForm.js
		//data = {application, group, name, description, expression, notes, locked}
		//We need to add on the addition fields: addDate, editDate, user
		let newVarData = {...data};
		newVarData.createDate = moment().unix();
		newVarData.createUser = this.props.user;
		newVarData.modifyDate = '';

		//Call the serverAPI to add this new variable
		addQlikVariable(newVarData)
			.then(resp => {
				this.setState({
					currApplication: 'Select an Application...',
					groupList: []
				});
			});
	}
//Handles a clear form
	handleOnClearForm = () => {
		this.setState({
			currApplication: 'Select an Application...',
			groupList: []
		});
	}
//Handles when an application is selected and/or changed
	handleOnApplicationChange = (newApplication, groupSearch) => {
		let currApplication = newApplication
		//if groupSearch is true, then we only want to return groups for the current application
		if (groupSearch) {
			this.handleCheckboxGroupSearch(currApplication, groupSearch)
		} else {
			//Get the Variables for the selected application and create a grouplist from it
			//We slice off the first group because it will be the default 'All' group.
			getAllGroups()
				.then(data => {
						let groupList = this.state.newGroupName !== '' ? [this.state.newGroupName, ...data] : data;
						this.setState({
							groupList, //: [this.state.newGroupName, ...data], //change
							currApplication
						});
				});
		}
	}
	handleNewApplicationName = newAppName => {
		//Call api call to add the new app name to the appnames.json file
		addAppName(newAppName)
			.then(resp => {
				if (resp.error) {
					console.log('AddQVVarContainer.js - handleNewApplicationName-', resp.error);
				}
				//Get the data from the applications.json file (current just application name)
				getApplicationData()
					.then(data => {
						this.setState({
							applicationList: data.map(obj => obj.appName),
							currApplication: newAppName
						});
						getAllGroups()
							.then(data => {
									let groupList = this.state.newGroupName !== '' ? [this.state.newGroupName, ...data] : data;
									this.setState({
										groupList //: [this.state.newGroupName, ...data] //change
									});
							});
					});
			});
	}
	handleNewGroupName = newGroupName => {
		this.setState({
			groupList: [newGroupName, ...this.state.groupList],
			newGroupName
		});
	}
	handleCheckboxGroupSearch = (currApp,checked) => {
		//If checked we are just going to get the groups in that variable list
		if (checked) {
			getApplicationVariables(currApp)
				.then(data => {
					this.setState({
							groupList: [this.state.newGroupName, ...createGroupList(data).slice(1)],
							currApplication: currApp
						});
					}
					);
		} else {
			//If not checked we will return all groups using the handleOnApplicationChange function
			this.handleOnApplicationChange(currApp, false);
		}
	}
	componentDidMount () {
		//When component mounts, clear out the Application Variable state
		//This will clear out the qvVariables, applications and appState redux store nodes
		this.props.dispatch(loadApplicationVariables('', ''));
		getApplicationData()
			.then(data => {
				this.setState({
					applicationList: data.map(obj => obj.appName)
				});
			});
	}
	render() {
		let renderAllFields = false;
		if (this.state.currApplication !== '' && this.state.currApplication !== 'Select an Application...') {
			renderAllFields = true;
		}
		return (
			<AddQVVarForm
				renderAllFields={renderAllFields}
				onSaveToSever={this.handleSaveToServer}
				onClearForm={this.handleOnClearForm}
				onApplicationChange={this.handleOnApplicationChange}
				onNewApplicationName={this.handleNewApplicationName}
				onNewGroupName={this.handleNewGroupName}
				onCheckboxGroupSearch={this.handleCheckboxGroupSearch}
				dispatch={this.props.dispatch}
				applicationList={this.state.applicationList}
				currApplication={this.state.currApplication}
				groupList={this.state.groupList}
				initialValues={this.props.initialValues}
			/>
		);
	}
}


	//applicationList: state.applications.applicationList,

const mapStateToProps = (state) => {
	return {
		initialValues: {application: 'Select an Application...', locked: false},
		user: state.appState.user
	};
};

export default connect(mapStateToProps)(AddQVVarContainer);
