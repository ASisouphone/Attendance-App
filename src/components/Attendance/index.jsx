import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom';
import AttendanceList from '../AttendanceList';


class AttendancePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markedMembers: [],
            currMembers: []
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
            <div>
                <h1>Attendance Page</h1>
                <button onClick={this.goBack}>Back</button>
                <AddMemberForm />

                <h1>Current Members</h1>
                <AttendanceList memberList={fitleredMembers} mark={this.markMember} />

                <h1>Marked Members</h1>
                <AttendanceList memberList={markedMembers} unmark={this.unmarkMember} />

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
                <input name="name" value={name} onChange={this.onChange} type="text" placeholder="Member Name" />
                <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Member Email" />
                <button disabled={isInvalid} type="submit">Add Member</button>
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