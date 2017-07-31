import React from 'react';
import { Icon } from 'antd';

const QVSearchVars = props => {
	return (
		<div>
			<label>{props.placeholder}</label>
			<input
					type="text"
					placeholder={props.placeholder}
					value={props.value}
					onChange={(e) => props.onSearchTextChange(e.target.value)}
					style={{display:"inline-block",width:"85%"}}
			/>
			<button type="button" className="hollow button small"
				onClick={() => props.onSearchTextChange('')}
				style={{verticalAlign:"-webkit-baseline-middle"}}
			>
				<Icon type="close" />
			</button>
		</div>
	);
};

export default QVSearchVars;
