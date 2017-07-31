import React from 'react';
import * as api from '../api';
import { connect, dispatch } from 'react-redux';

import { startLoadApplicationVars } from '../actions';


class QVAppList extends React.Component {

	render() {
		return (
			<div className="QV-App-List">
				{this.props.applicationList.map(app => {
					const activeClass = this.props.selectedApplication === app ? "active" : "";
					return (
							<li key={app} className={activeClass} style={{display: 'inline-block', width:'100%'}}>
								<a onClick={() => this.props.startLoadApplicationVars(app)}>{app} </a>
							</li>
					);
				})}
			</div>
		);
	}
}

export default connect(null, { startLoadApplicationVars })(QVAppList);
