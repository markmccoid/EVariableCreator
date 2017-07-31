import React from 'react';
import { Link, IndexLink } from 'react-router';

//Html Function by Oliviu Stoian from the Noun Project (logo image)
const Navbar = (props) => {
		return (
			<div className="row">
			<div className="columns">
				<div className="top-bar" data-topbar role="navigation" style={{border: "1px solid hsla(0,0%,4%,.25)"}}>
					<div className="top-bar-left">
						<span className="title" style={{fontSize:"1.3em", fontWeight: "bold"}}>Analytix Variable Editor</span>
						<span style={{fontSize:"1.3em", fontWeight: "bold", color: "red"}}> --> {props.user}</span>
						<ul className="menu">
						  <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
							<li><Link to="/addqvvar" activeClassName="active">Add New Variable</Link></li>
							<li><Link to="/settings" activeClassName="active">Settings</Link></li>
							<li><Link to="/export" activeClassName="active">Export</Link></li>
						</ul>
					</div>
					<div className="top-bar-right">
						<img src="./images/logo.png" width="50" height="50"/>
			    </div>
				</div>
			</div>
			</div>
		);
	};


export default Navbar;
