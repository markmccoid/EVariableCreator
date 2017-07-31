import React from 'react';

class AppEditView extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			exportName: this.props.application.exportName || '',
			viewName: this.props.application.viewName || ''
		};
	}

	render() {
		const { exportName, viewName } = this.state;
		return (
			<div className="row appedit-view callout">
				<form onSubmit={e => {
						e.preventDefault();
						this.props.onSubmitApp(exportName, viewName, this.props.application.id);
					}}>
					<div className="columns">
						<label>Export Name (No Spaces or special characters)</label>
						<input
							type="text"
							placeholder="Export Name"
							value={this.state.exportName}
							onChange={(e) => this.setState({exportName: e.target.value})}
						/>
					</div>
					<div className="columns">
						<label>View Name</label>
						<input
							type="text"
							placeholder="View Name"
							value={this.state.viewName}
							onChange={(e) => this.setState({viewName: e.target.value})}
						/>
					</div>
					<div className="columns">
						<button type="submit" className="button" style={{marginRight:"10px"}}>Save</button>
						<button className="button">Cancel</button>
					</div>
				</form>
			</div>
		)
	}
};

export default AppEditView;
