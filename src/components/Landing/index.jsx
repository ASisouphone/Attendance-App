import React, { Component, useCallback } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { withRouter } from 'react-router-dom';
import OrgList from '../OrgList';
import * as ROUTES from '../../constants/routes';

class Landing extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currUser: {
        name: '',
        email: ''
      },
      loading: false,
      orgList: [],
      myOrgs: []
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.user(localStorage.getItem("userId")).on('value', snapshot => {

      const tempCurrUser = {
        name: snapshot.val().username,
        email: snapshot.val().email
      }

      const myOrgObj = snapshot.val().organizations;

      var myOrgList = []

      if (myOrgObj) {
        myOrgList = Object.keys(myOrgObj).map(key => ({
          ...myOrgObj[key],
          orgId: key
        }))
      }

      this.setState({
        currUser: tempCurrUser,
        myOrgs: myOrgList,
      })

    });

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

    // this.props.firebase.user(localStorage.getItem("userId")).once('value', snapshot=> {
    // })
  }

  componentWillUnmount() {
    this.props.firebase.user(localStorage.getItem("userId")).off();
    this.props.firebase.organizations().off();
  }

  goToMeetings = orgId => {
    this.props.history.push(ROUTES.MEETINGS + "/" + orgId)
  }

  removeFromMyOrgs = orgId => {
    // this.props.firebase.organizations().child(orgId).set(null);
    this.props.firebase
      .userOrgs(localStorage.getItem("userId"))
      .child(orgId)
      .set(null);

      this.props.firebase
      .orgMembers(orgId)
      .child(localStorage.getItem("userId"))
      .set(null);
  }

  addToMyOrgs = org => {
    let { orgId, ...other } = org; //...other is org info

    this.props.firebase
      .userOrgs(localStorage.getItem("userId"))
      .child(orgId)
      .set({ ...other });

    this.props.firebase
      .orgMembers(orgId)
      .child(localStorage.getItem("userId"))
      .set(this.state.currUser);
  }

  render() {
    const { orgList, myOrgs, loading, currUser } = this.state;

    var filteredOrgs = orgList;

    // Once both lists are loaded
    if (orgList.length > 0 && myOrgs.length > 0) {

      // List of orgs user is not in
      filteredOrgs = orgList.filter(x => {
        let notFound = true;
        myOrgs.forEach(y => {
          if (x.orgId == y.orgId) {
            notFound = false;
          }
        })
        return notFound;
      });
    }

    return (
      <div>
        <h1>GVSU Attendnace</h1>
        <p>A better way to track attendance for your organization</p>
        <AddOrgForm />
        <h1>My Orgs</h1>
        <OrgList orgList={myOrgs} remove={this.removeFromMyOrgs} link={this.goToMeetings} />
        <h1>All Organizations</h1>
        <OrgList orgList={filteredOrgs} add={this.addToMyOrgs} />
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


const condition = authUser => !!authUser;

Landing = compose(
  withFirebase,
  withRouter,
  withAuthorization(condition))(Landing)


export default Landing;

export { AddOrgForm }