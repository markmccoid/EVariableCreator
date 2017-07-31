import React from 'react';

class QVGroupSelect extends React.Component {
	displayGroupList() {
		let { groupList } = this.props;
		let groupsOptionHTML = groupList.map(function(arrItem, idx){
			let output = '';
			let groupName = arrItem;
			output = <option value={groupName} key={idx}>{groupName}</option>;
			return (output);
		});
		return (
				<label> Group List
					<select
						onChange={(e) => this.props.onGroupChanged(e.target.value)}
						value={this.props.selectedGroup}
					>
						{groupsOptionHTML}
					</select>
				</label>
			);
	}

	render() {
		return (
			<div>
				{this.displayGroupList()}
			</div>
		);
	}
}

QVGroupSelect.propTypes = {
	groupList: React.PropTypes.array,
	onGroupChanged: React.PropTypes.func,
	selectedGroup: React.PropTypes.string
}

export default QVGroupSelect;
