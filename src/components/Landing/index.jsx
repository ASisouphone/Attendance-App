import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

const Landing = () => (
  <div>
    <h1>GVSU Attendnace</h1>
    <p>A better way to track attendance for your organization</p>
    <AddOrgForm />
  </div>
);

const INITIAL_STATE = {
  orgName: ''
};

class AddOrgFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {

    const { orgName } = this.state;

    this.props.firebase.organizations().push({
      orgName
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
    const { orgName } = this.state;

    const isInvalid = orgName === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input name="orgName" value={orgName} onChange={this.onChange} type="text" />

        <button disabled={isInvalid} type="submit">Add Org</button>

      </form>
    );
  }
}

const AddOrgForm = compose(withFirebase)(AddOrgFormBase);

export default Landing;

export { AddOrgForm }