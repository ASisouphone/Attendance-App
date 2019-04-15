import React, { Component, useCallback } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import OrgList from '../OrgList';

class Landing extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      orgList: [],
      myOrgs: []
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.userOrgs(localStorage.getItem("userId")).on('value', snapshot => {
      const myOrgObj = snapshot.val();

      var myOrgList = []

      if (myOrgObj) {
        myOrgList = Object.keys(myOrgObj).map(key => ({
          ...myOrgObj[key],
          orgId: key
        }))
      }
      
      this.setState({
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
  }

  componentWillUnmount() {
    this.props.firebase.organizations().off();
  }

  removeFromMyOrgs = orgId => {
    console.log(orgId);
    // this.props.firebase.organizations().child(orgId).set(null);
    this.props.firebase
      .userOrgs(localStorage.getItem("userId"))
      .child(orgId)
      .set(null);
  }

  addToMyOrgs = org => {
    console.log(org);
    let { orgId, ...other} = org;

        this.props.firebase
            .userOrgs(localStorage.getItem("userId"))
            .child(orgId)
            .set({...other});
  }

  render() {

    const { orgList, myOrgs, loading } = this.state;
    console.log("All Orgs!", orgList);
    console.log("My Orgs!", myOrgs);

    var filteredOrgs = orgList;

    // Once both lists are loaded
    if (orgList.length > 0 && myOrgs.length > 0) {

      // List of orgs user is not in
      filteredOrgs = orgList.filter(x=>{
        let notFound = true;
        myOrgs.forEach(y=>{
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
        <OrgList orgList={myOrgs} remove={this.removeFromMyOrgs}/>
        <h1>All Organizations</h1>
        <OrgList orgList={filteredOrgs} add={this.addToMyOrgs}/>
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