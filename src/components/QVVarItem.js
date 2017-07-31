import React from 'react';
import { Tooltip, Icon } from 'antd';

const QVVarItem = (props) => {
	return (
			<div className="column small-4">
				<Tooltip title={`${props.qvVar.locked ? 'Locked Field! - \n' : ''}${props.qvVar.description}`}>
					<a onClick={() => props.onSelectVar(props.qvVar.id)}>
						<div className="field-item">
							{ props.qvVar.locked ? <Icon type="lock" style={{color:"red"}} /> : null}
							{props.qvVar.name}
						</div>
					</a>
				</Tooltip>
			</div>
	);
};

QVVarItem.propTypes = {
	onSelectVar: React.PropTypes.func, //redux function to update selectedVariableId in store
	selectedVariableId: React.PropTypes.string,
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
}


export default QVVarItem;

// const QVVarItem = (props) => {
// 	return (
// 		<div className="row" style={{border:"1px solid red", marginBottom:"5px"}}>
// 			<div className="column small-4">
// 				<div className="field-item"> {props.qvVar.name} </div>
// 			</div>
// 			<div className="column small-8">
// 				<div className="field-item"> {props.qvVar.description} </div>
// 			</div>
// 		</div>
// 	);
// };
