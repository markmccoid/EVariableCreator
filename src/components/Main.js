import React from 'react';
import { connect } from 'react-redux';

//Import Components
import Navbar from 'Navbar';


class Main extends React.Component {
constructor(props) {
	super(props);

}
	render() {
		return (
			<div >
					<Navbar user={this.props.user}/>
					{this.props.children}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.appState.user
	};
};

export default connect(mapStateToProps)(Main);
