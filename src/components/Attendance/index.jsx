import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom';


class AttendancePage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            marked: [],
            currMembers: []
        }
    }

    render() {
        return (
            <div>
                <h1>Attendance Page</h1>
            </div>
        )
    }

}
const condition = authUser => !!authUser;

  AttendancePage = compose(
    withFirebase,
    withRouter,
    withAuthorization(condition))(AttendancePage)


export default AttendancePage;