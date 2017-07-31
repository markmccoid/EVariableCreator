import React from 'react';

const QVGroupDisplay = (props) => {
	const { group, selectedGroup } = props;
//Determine if on next click we update the selectedGroup to blank (nothing selected) or to the clicked group
	let groupToUpdate = (group === selectedGroup) ? '' : group;

  return (
    <div className="row callout" style={{backgroundColor: "#d1e2b6"}}>
			<div key={group} className="column small-12 group-title">
					<a onClick={() => props.onGroupChanged(groupToUpdate)}>{group}</a>
			</div>
      {props.children}
    </div>
  );
};

QVGroupDisplay.propTypes = {
	onGroupChanged: React.PropTypes.func.isRequired,
	group: React.PropTypes.string.isRequired,
	selectedGroup: React.PropTypes.string
}
export default QVGroupDisplay;
