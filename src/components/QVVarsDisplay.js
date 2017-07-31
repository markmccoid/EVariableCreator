import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'antd';

import QVVarItem from './QVVarItem';
import QVGroupSelect from './QVGroupSelect';
import QVGroupDisplay from './QVGroupDisplay';
import QVVarItemDetail from './QVVarItemDetail';
import QVVarItemEdit from './QVVarItemEdit';
import QVSearchVars from './QVSearchVars';

//Import actions
import { updateSelectedGroup,
					updateSelectedVariable,
					updateEditState,
					startUpdateApplicationVar,
					startDeleteApplicationVar,
					updateSearchText,
					updateHideLocked } from '../actions';

//QV Variable manipulation functions
import { createGroupList, filterVars, getAllGroups } from '../api';

class QVVarsDisplay extends React.Component {

	handleGroupChanged = (selectedGroup) => {
		this.props.dispatch(updateSelectedGroup(selectedGroup));
	}

	renderGroupSelect() {
		let qvVars = [...this.props.qvVariables];
		let groupList = createGroupList(qvVars);
		return (
			<QVGroupSelect
				groupList={groupList}
				selectedGroup={this.props.appState.selectedGroup}
				selectedApplication={this.props.applications.selectedApplication}
				onGroupChanged={this.handleGroupChanged}
			/>
		)
	}
	renderQVVariables() {
		let { appState, appState: { searchText, selectedGroup, hideLocked }, qvVariables } = this.props;
		//Get an array of var objects based on the Group selected (could be all variables)
		let filteredVars = filterVars(qvVariables, appState.searchText, appState.selectedGroup || 'All', hideLocked);
		let filteredVarsLength = filteredVars.length;
		//Get an array of distinct groups in the full qvVars array (for specific applciation that was selected)
		let groupList = createGroupList([...this.props.qvVariables]);
		//Get a list of groups matching what is in filteredVars (i.e. if someone selected a group, we only want to have the group in our groupList)
		let finalGroupList = groupList.filter(group =>
			filteredVars.filter(qvVar => group === qvVar.group).length > 0
		);
		//Loop through the groupList and display a header for each group that has
		//vars in the filterVars array and display the vars.
		//returns an object - {varCount: int, jsx: string}
		return {
			varCount: filteredVarsLength,
			jsx: finalGroupList.map(group => {
			// let groupTitle = <div key={group} className="column small-12 group-title">
			// 		<a onClick={() => this.handleGroupChanged(group)}>{group}</a>
			// 	</div>;
			let groupVars = filteredVars.filter(qvVar => qvVar.group === group)
					.map(qvVar => {
						//If the qvVar is the selectedVariableId from redux store
						//then check if we are editing
						let initValues = {
							name: qvVar.name,
							description: qvVar.description,
							expression: qvVar.expression,
							notes: qvVar.notes,
							locked: qvVar.locked,
							group: qvVar.group
						};

							if (appState.selectedVariableId === qvVar.id) {
								if (appState.editing) {
									//If editing return the QVVarItemEdit Component
									return (
										<QVVarItemEdit
											key={qvVar.id}
											qvVar={qvVar}
											editingUser={this.props.appState.user}
											initialValues={initValues}
											groupList={groupList}
											onCancelEdit={() => this.props.dispatch(updateEditState(null))}
											onSaveEdit={saveObj => {
													this.props.dispatch(startUpdateApplicationVar(saveObj))
														.then(res => this.props.dispatch(updateEditState(null)));
												}
											}
										/>
									);
								} else {
									//If not editing return the QVVarItemDetail Component
									return (
										<QVVarItemDetail
											qvVar={qvVar}
											key={qvVar.id}
											onEditVar={id => this.props.dispatch(updateEditState(id))}
											onSelectVar={id => this.props.dispatch(updateSelectedVariable(id))}
											onDeleteVar={id => this.props.dispatch(startDeleteApplicationVar(id))}
										/>
									);
								}
							}
							return (<QVVarItem
												qvVar={qvVar}
												key={qvVar.id}
												selectedVariableId={appState.selectedVariableId}
												onSelectVar={id => this.props.dispatch(updateSelectedVariable(id))}
											/>);
						});

						//QVGroupDisplay is a simple contianer that shows the children (group titles and QVVarItems)
						return <QVGroupDisplay key={group} onGroupChanged={this.handleGroupChanged} group={group} selectedGroup={appState.selectedGroup}>
								{ groupVars }
							</QVGroupDisplay>;
			})
		};
	}
	render() {
		if (!this.props.applications.selectedApplication) {
			return <div></div>
		}

		//returns an object - {varCount: int, jsx: string}
		let renderQVVarObject = this.renderQVVariables();

		return (
			<div>

				<div className="row align-center">
					<h3 className="text-center">{renderQVVarObject.varCount} - Variables for {this.props.applications.selectedApplication}</h3>
				</div>

				<div className="row">
					<div className="column small-4">
						{this.renderGroupSelect()}
					</div>

					<div className="column small-5">
						<QVSearchVars
							value={this.props.appState.searchText}
							onSearchTextChange={(searchText) => this.props.dispatch(updateSearchText(searchText))}
							placeholder="Search Variable Names"
						/>
					</div>

					<div className="column small-3">
						<label>Quick Search</label>
						<Checkbox
							checked={this.props.appState.hideLocked}
							onChange={(e) => this.props.dispatch(updateHideLocked(e.target.checked))}
						>
							Hide Locked Variables
						</Checkbox>
					</div>
				</div>

				{renderQVVarObject.jsx}

			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		applications: state.applications,
		qvVariables: state.qvVariables,
		appState: state.appState
	}
};

export default connect(mapStateToProps)(QVVarsDisplay);
