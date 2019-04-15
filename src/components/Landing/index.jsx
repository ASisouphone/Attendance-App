import React, { Component, useCallback } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import OrgList from '../OrgList';

class Landing extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      orgList: []
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.organizations().on('value', snapshot => {
      const orgListObj = snapshot.val();

      // Move ID inside org object
      const orgList = Object.keys(orgListObj).map(key => ({
        ...orgListObj[key],
        orgId: key
      }))

      this.setState({
        orgList: orgList,
        loading: false
      })

    })
  }

  componentWillUnmount() {
    this.props.firebase.organizations().off();
  }

  render() {

    const { orgList, loading } = this.state;
    console.log(orgList);

    return (
      <div>
        <h1>GVSU Attendnace</h1>
        <p>A better way to track attendance for your organization</p>
        <AddOrgForm />
        <OrgList orgList={orgList} />
        {/* <ul>
          {orgList.map(org => (
            <li key={org.orgId}>
              <span>{org.orgName}</span>
            </li>
          ))}
        </ul> */}
      </div>

    )
  }
}

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

export default withFirebase(Landing);

export { AddOrgForm }