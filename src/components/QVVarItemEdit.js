import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, destroy } from 'redux-form';
import { Icon } from 'antd';
import moment from 'moment';


const validate = values => {
	const errors = {}
	if (!values.name) {
		errors.name = 'Required'
	}
	if (!values.description) {
		errors.description = 'Required'
	}
	if (!values.expression) {
		errors.expression = 'Required'
	}
	return errors
};

class QVVarItemEdit extends React.Component {
	clickCancelEdit(e) {
		e.preventDefault();
		//User canceled, so destroy form data
		//destroy({form: 'qvVar'}); //Will destroy automatically on unmount
		//Calls the updateEditState action with Null.
		//This will set appState.editing: false, appState.selectedVariableId: null
		this.props.onCancelEdit();
	}

	renderField(props) {
		return (
			<div>
				<label style={{height:"28px"}}>{props.placeholder}:
					{props.meta.touched && props.meta.error ? <span className="field-error">{props.meta.error}</span> : null}
				</label>
					<input {...props.input} type={props.type}/>
			</div>
		)
	}
	renderTextArea(props) {
		return (
			<div>
				<label style={{height:"28px"}}>{props.placeholder}:
					{props.meta.touched && props.meta.error ? <span className="field-error">{props.meta.error}</span> : null}
				</label>
					<textarea {...props.input} type={props.type} />
			</div>
		)
	}
	renderDropDown(props) {
		return (
			<div>
				<label style={{height:"28px"}}>{props.placeholder}:</label>
				<select {...props.input}>
					{props.data.map(item => <option key={item} value={item}>{item}</option>)}
				</select>
			</div>
		);
	}
	renderLockedInput (props) {
		const lockedValue = props.input.value
		console.log('renderLockedInput', lockedValue);
		return (
			<div>
				<label style={{height:"28px"}}>{props.placeholder}:</label>
					<div
						className={lockedValue ? "field-item locked" : "field-item"}
						onClick={ e => {
							props.input.onChange(!lockedValue);
						}}
					>
					{lockedValue ?
						<span>Locked <Icon type="lock" style={{float: "right"}}/></span> :
						<span>Unlocked <Icon type="unlock" style={{float: "right"}}/></span> }
					</div>
				</div>
		);
	}
	render() {
		const { id, name, description, expression, notes, locked } = this.props.qvVar;
		const { handleSubmit, invalid, submitting } = this.props;
		//Need to create a list of groups without the "All"
		let groupListNoAll = this.props.groupList.slice(1);
		//groupListNoAll.shift();

		//function to save form data to server
		const saveToServer = data => {
			//when editing a variable the user cannot change the
			//application, addDate or user fields, this is why we
			//are pulling these fields values from the qvVar props object
			let saveObj = {
				id,
				application: this.props.qvVar.application,
				group: data.group,
				name: data.name,
				expression: data.expression,
				description: data.description,
				notes: data.notes,
				locked: data.locked,
				modifyDate: moment().unix(),
				modifyUser: this.props.editingUser
			};
			//dispatch action from QVVarsDispaly.js
			this.props.onSaveEdit(saveObj);
		};

		return (
			<div className="column small-12 variable-display">
				<form onSubmit={handleSubmit(data => saveToServer(data))}>
					<div className="column small-6">
						<Field name="name" component={this.renderField} type="text" placeholder="Name" />
					</div>
					<div className="column small-6">
							<Field name="group" component={this.renderDropDown} type="select" placeholder="Group" data={groupListNoAll} />
					</div>
					<div className="column small-12">
						<Field name="description" component={this.renderField} type="text" placeholder="Description"/>
					</div>
					<div className="column small-12">
						<Field name="expression" component={this.renderTextArea} type="text" placeholder="Expression"/>
					</div>
					<div className="column small-8">
						<Field name="notes" component={this.renderTextArea} type="text" placeholder="Notes"/>
					</div>
					<div className="column small-4">
		        <Field name="locked" component={this.renderLockedInput} type="" placeholder="Locked?"/>
		      </div>
					<div className="column small-12">
						<button
								type="submit"
								className="button small"
								style={{marginRight:"5px"}}
								disabled={invalid || submitting}
						>Save</button>
					<button className="button small" onClick={(e) => this.clickCancelEdit(e)}>Cancel</button>
					</div>
				</form>
			</div>
		);
	}
}

QVVarItemEdit.propTypes = {
	onCancelEdit: React.PropTypes.func, //redux action to update edit indicator
  onSaveEdit: React.PropTypes.func, //redux function to update selectedVariableId in store
	initialValue: React.PropTypes.shape({
		name: React.PropTypes.string,
		description: React.PropTypes.string,
		expression: React.PropTypes.string,
		notes: React.PropTypes.string,
		locked: React.PropTypes.boolean,
		group: React.PropTypes.string
	}),
	groupList: React.PropTypes.array,
	qvVar: React.PropTypes.shape({
		id: React.PropTypes.string,
		application: React.PropTypes.string,
		name: React.PropTypes.string,
		description: React.PropTypes.string,
		expression: React.PropTypes.oneOfType([
								    React.PropTypes.string,
								    React.PropTypes.number
									]),
		notes: React.PropTypes.string,
		group: React.PropTypes.string,
		locked: React.PropTypes.boolean,
		createDate: React.PropTypes.number,
		modifyDate: React.PropTypes.oneOfType([
								    React.PropTypes.string,
								    React.PropTypes.number
									]),
		createUser: React.PropTypes.string,
		modifyUser: React.PropTypes.string
	}),
	editingUser: React.PropTypes.string
};
export default reduxForm({
		form: 'qvVar',
		validate
	})(QVVarItemEdit);
