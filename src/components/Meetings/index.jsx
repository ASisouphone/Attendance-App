import React, { Component, useCallback } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom';
import MeetingList from '../MeetingList';

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
        this.props.firebase.meetings().off();
    }


    render() {

        const { meetingList } = this.state;

        return (
            <div>
                <h1>MeetingsPage</h1>
                <span>{this.props.match.params.orgId}</span>
                <AddMeetingForm />
                <hr/>
                {/* {meetingList.map(meeting => (<li key={meeting.meetId}>{meeting.name}</li>))} */}
                <MeetingList meetingList={meetingList}></MeetingList>
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
                <input name="name" value={name} onChange={this.onChange} type="text" />
                <button disabled={isInvalid} type="submit">Add Meeting</button>
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