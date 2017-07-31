import React from 'react';

class AppLogin extends React.Component {
	constructor (props) {
		super(props);
	}

	render() {

		return (
			<div>
				<div className="row">
					<div className="columns small-centered small-10 medium-6" >
						<div className="callout callout-auth">
							<h3>Login</h3>
								<p> Login Form</p>
						</div>

					</div>
				</div>
			</div>
			)
	}
}

export default AppLogin;
