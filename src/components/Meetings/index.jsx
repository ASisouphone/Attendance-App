import React, { Component, useCallback } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom';
import MeetingList from '../MeetingList';
import './meetings.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class MeetingsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            meetingList: [],
        }
    }

    componentDidMount() {

        const orgId = this.props.match.params.orgId;
        this.props.firebase.meetings().child(orgId).on('value', snapshot => {
            const meetingsObj = snapshot.val();

            var tempMeetingList = [];
            if (meetingsObj) {
                tempMeetingList = Object.keys(meetingsObj).map(key => ({
                    ...meetingsObj[key],
                    meetId: key
                }))
            }

            this.setState({
                meetingList: tempMeetingList
            })
        })

    }

    componentWillUnmount() {
        const orgId = this.props.match.params.orgId;
        this.props.firebase.meetings().child(orgId).off();
    }

    goToAttendance = (meetId) => {
        this.props.history.push(this.props.match.url + "/attendance/" + meetId);
    }

    goBack = () => {
        this.props.history.goBack();
    }

    remove = (meeting) => {
        const orgId = this.props.match.params.orgId;
        this.props.firebase.meetingsByOrg(orgId)
            .child(meeting.meetId)
            .set(null);

        this.props.firebase.meetingAttendees(orgId, meeting.meetId).set(null);
    }


    render() {

        const { meetingList } = this.state;

        return (
            <div className="content-wrapper">
                <AddMeetingForm /> <br/>
                <Button variant="outlined" color="primary" onClick={this.goBack}>Go Back</Button>
                <h1>Meetings</h1>
                <MeetingList meetingList={meetingList} link={this.goToAttendance} remove={this.remove}></MeetingList>
            </div>

        )
    }

}

const INITIAL_STATE = {
    name: ''
};

class AddMeetingFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }
    }

    onSubmit = event => {
        const { name } = this.state;
        const orgId = this.props.match.params.orgId;
        this.props.firebase.meetings().child(orgId).push({
            name
        });

        event.preventDefault();
        this.resetState();
    }

    resetState() {
        this.setState(INITIAL_STATE);
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { name } = this.state;
        const orgId = this.props.match.params.orgId;
        const isInvalid = name === '';

        return (
            <form onSubmit={this.onSubmit}>
                <TextField name="name" value={name} onChange={this.onChange} placeholder="Meeting Name" type="text" /> &nbsp;
                <Button variant="contained" color="primary" disabled={isInvalid} type="submit">Add Meeting</Button>
            </form>
        );
    }
}

const AddMeetingForm = compose(withFirebase, withRouter)(AddMeetingFormBase);


const condition = authUser => !!authUser;

MeetingsPage = compose(
    withFirebase,
    withRouter,
    withAuthorization(condition))(MeetingsPage)


export default MeetingsPage;

export { AddMeetingForm }