import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import QVAppList from './QVAppList';
import QVVarsDisplay from './QVVarsDisplay';
import * as api from '../api';
import { startLoadApplicationList } from '../actions';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.div`
  width: 200px;
`;

const MainContent = styled.div`
  width: 100%;
  margin: 0 !important;
`;

class MainDisplay extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    //When component mounts, clear out the Application Variable state
    //This will clear out the qvVariables, applications and appState redux store nodes
    this.props.dispatch(startLoadApplicationList());
  }
  render() {
    return (
      <Row>
        <Sidebar>
          <h5 className="text-center">Application List</h5>
          <ul className="menu vertical">
            <QVAppList
              applicationList={this.props.applications.applicationList}
              selectedApplication={this.props.applications.selectedApplication}
            />
          </ul>
        </Sidebar>
        <MainContent className="callout secondary">

          <QVVarsDisplay />
        </MainContent>
      </Row>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    applications: state.applications
  }
};
export default connect(mapStateToProps)(MainDisplay);



// return (
//   <div className="row">
//     <div className="columns callout secondary small-2"
//           style={{padding: "5px 0", marginLeft: "15px", marginBottom:"0px", minWidth: "200px", maxWidth: "200px"}}>
//       <h5 className="text-center">Application List</h5>
//       <ul className="menu vertical">
//         <QVAppList
//           applicationList={this.props.applications.applicationList}
//           selectedApplication={this.props.applications.selectedApplication}
//         />
//       </ul>
//     </div>
//     <div className="columns callout secondary" style={{marginLeft: "-1px", marginRight: "15px", marginBottom:"0px"}}>
//
//       <QVVarsDisplay />
//     </div>
//   </div>
// );
