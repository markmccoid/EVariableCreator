import React from 'react';

class AppRowView extends React.Component {
	//Move this into Container
	deleteAppName = () => {

	}
	render() {
		const onSubmitForm = () => {
			this.props.onSaveApplication(this.input.value, this.props.application.id);
		};
		const onInputEdit = e => {
			if (e.charCode === 13) {
				onSubmitForm();
			}
		};
		const renderEditBox = () => {
			return (
					<input type="text" ref={input => this.input = input} placeholder={this.props.application.appName} onKeyPress={onInputEdit}/>
			)
		};
		const renderButtons = () => {
			if (this.props.isEditing) {
				return (
					<div>
						<a className="button hollow" onClick={() => onSubmitForm()}>
							Save
						</a>
						<a className="button hollow" onClick={() => this.props.onEditApplication('')}>
							Cancel
						</a>
					</div>
				)
			} else {
				return (
					<div>
						<a className="button hollow" onClick={() => this.props.onEditApplication(this.props.application.id)}>
							Edit
						</a>
						<a className="button hollow" onClick={() => this.props.onDeleteApplication(this.props.application.appName, this.props.application.id)}>
							Delete
						</a>
					</div>
				);
			}
		};
		return (
			<div className="row appview-row">
				<div className="column small-4">
					{this.props.isEditing ? renderEditBox() : this.props.application.appName}
				</div>
				<div className="column small-4 appview-column align-center">
					{renderButtons()}
				</div>
			</div>
		);
	}
}

AppRowView.propTypes = {
	application: React.PropTypes.object.isRequired,
	isEditing: React.PropTypes.bool,
	onEditApplication: React.PropTypes.func,
	onSaveApplication: React.PropTypes.func,
	onDeleteApplication: React.PropTypes.func
}

export default AppRowView;
