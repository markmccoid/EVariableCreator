import React from 'react';
import { Icon } from 'antd';
var alertify = require('alertifyjs');

const QVVarItemDetail = (props) => {
  const { id, name, description, expression, notes, locked } = props.qvVar;
	const handleDeleteVar = () => {
		alertify.confirm('', `Confirm Deletion of ${name}:${id} variable`,
							() => {
								//find if show is a member in any group and delete it from the group
                alertify.success(`Deleted ${name} variable`);
								props.onDeleteVar(id);
							},
							() => {
								alertify.error(`Canceled delete of ${name} variable`)
							});
	};

  return (
    <div className="column small-12 variable-display">
      <div className="column small-4">
        <label>Name:</label>
        <div className="field-item var-name"> {name || '-'} </div>
      </div>
      <div className="column small-8">
        <label>Description:</label>
        <div className="field-item"> {description || '-'} </div>
      </div>
      <div className="column small-12">
        <label>Expression:</label>
        <div className="field-item"> {expression || '-'} </div>
      </div>
      <div className="column small-8">
        <label>Notes:</label>
        <div className="field-item"> {notes || '-'} </div>
      </div>
      <div className="column small-4">
        <label>Locked:</label>
        <div className={locked ? "field-item locked" : "field-item"}>
          {locked ?
						<span>Locked <Icon type="lock" style={{float: "right"}}/></span> :
						<span>Unlocked <Icon type="unlock" style={{float: "right"}}/></span> }
				</div>
      </div>
      <div className="column small-12">
        <button className="button small" onClick={() => props.onEditVar(id)} style={{marginRight:"5px"}}>Edit</button>
        <button className="button small" onClick={() => props.onSelectVar(null)}>Close</button>
				<button className="alert button small float-right" onClick={handleDeleteVar}>Delete</button>
      </div>
    </div>
  );
};

QVVarItemDetail.propTypes = {
	onEditVar: React.PropTypes.func, //redux action to update edit indicator
  onSelectVar: React.PropTypes.func, //redux function to update selectedVariableId in store
	onDeleteVar: React.PropTypes.func, //redux function to delete variable object on server and in store
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
		locked: React.PropTypes.boolean
	})
};

export default QVVarItemDetail;
