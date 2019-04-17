import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom';
import AttendanceList from '../AttendanceList';
import { Button, TextField, Grid } from '@material-ui/core';
import './attendance.css';

class AttendancePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markedMembers: [],
            currMembers: [],
        }
    }

    componentDidMount() {
        const orgId = this.props.match.params.orgId;
        const meetId = this.props.match.params.meetId;
        this.props.firebase.orgMembers(orgId).on('value', snapshot => {

            const memberObj = snapshot.val();

            var memberList = []

            if (memberObj) {
                memberList = Object.keys(memberObj).map(key => ({
                    ...memberObj[key],
                    memId: key
                }))
            }

            this.setState({
                currMembers: memberList,
            })

        })
        //

        this.props.firebase.meetingAttendees(orgId, meetId).on('value', snapshot => {
            const memberObj = snapshot.val();

            var memberList = []

            if (memberObj) {
                memberList = Object.keys(memberObj).map(key => ({
                    ...memberObj[key],
                    memId: key
                }))
            }

            this.setState({
                markedMembers: memberList,
            })
        })
    }

    componentWillUnmount() {
        const orgId = this.props.match.params.orgId;
        const meetId = this.props.match.params.meetId;

        this.props.firebase.orgMembers(orgId).off();
        this.props.firebase.meetingAttendees(orgId, meetId)
    }

    markMember = (member) => {
        console.log(member.name + "Has been marked");
        const orgId = this.props.match.params.orgId;
        const meetId = this.props.match.params.meetId;
        const { memId, ...other } = member;

        this.props.firebase.meetingAttendees(orgId, meetId)
            .child(memId)
            .set(other);
    }

    unmarkMember = (member) => {
        const orgId = this.props.match.params.orgId;
        const meetId = this.props.match.params.meetId;

        this.props.firebase.meetingAttendees(orgId, meetId)
            .child(member.memId)
            .set(null);
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {

        const { currMembers, markedMembers } = this.state;


        var fitleredMembers = currMembers;

        // Once both lists are loaded
        if (currMembers.length > 0 && markedMembers.length > 0) {

            // List of orgs user is not in
            fitleredMembers = currMembers.filter(x => {
                let notFound = true;
                markedMembers.forEach(y => {
                    if (x.memId == y.memId) {
                        notFound = false;
                    }
                })
                return notFound;
            });
        }

        return (
            <div className="content-wrapper">
                <AddMemberForm /> <br />
                <Button variant="outlined" color="primary" onClick={this.goBack}>Go Back</Button>
                <h1>Attendance</h1>

                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                        <h2>Current Members</h2>
                        <AttendanceList memberList={fitleredMembers} mark={this.markMember} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <h2>Marked Members</h2>
                        <AttendanceList memberList={markedMembers} unmark={this.unmarkMember} />
                    </Grid>
                </Grid>


            </div>
        )
    }

}

const INITIAL_STATE = {
    name: '',
    email: ''
};

class AddMemberFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }
    }

    onSubmit = event => {
        const { name, email } = this.state;
        console.log("User Info from Form: ", name, email);

        const orgId = this.props.match.params.orgId;
        this.props.firebase.orgMembers(orgId).push({
            name: name,
            email: email
        });

        this.resetState();
        event.preventDefault();
    }

    resetState() {
        this.setState(INITIAL_STATE);
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { name, email } = this.state;
        const orgId = this.props.match.params.orgId;
        const isInvalid = (name === '' || email === '');

        return (
            <form onSubmit={this.onSubmit}>
                <TextField name="name" value={name} onChange={this.onChange} type="text" placeholder="Member Name" /> &nbsp;
                <TextField name="email" value={email} onChange={this.onChange} type="text" placeholder="Member Email" />&nbsp;
                <Button variant="contained" color="primary" disabled={isInvalid} type="submit">Add Member</Button>
            </form>
        );
    }
}

const AddMemberForm = compose(withFirebase, withRouter)(AddMemberFormBase);

const condition = authUser => !!authUser;

AttendancePage = compose(
    withFirebase,
    withRouter,
    withAuthorization(condition))(AttendancePage)


export default AttendancePage;

export { AddMemberForm }