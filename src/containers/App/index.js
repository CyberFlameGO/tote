import React, { Component } from 'react';
import firebase from 'firebase';
import LoggedIn from '../LoggedIn';
import LoggedOut from '../LoggedOut';

const provider = new firebase.auth.GoogleAuthProvider();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  state = {
    loading: true,
    loggedIn: false,
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          loading: false,
          user,
        });
      } else {
        this.setState({
          loggedIn: false,
          loading: false,
          user: null,
        });
      }
    });
  }

  login() {
    firebase.auth().signInWithRedirect(provider).then((result) => {
        this.setState({
          loggedIn: true,
          user: result.user,
        });
      }).catch((error) => {
        this.setState({
          loggedIn: false,
        })
      });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.setState({ loggedIn: false });
    });
  }

  render() {
    const { loading, loggedIn, user } = this.state;

    if (loading) return null;
    if (loggedIn && user) return <LoggedIn user={user} logout={this.logout} />;

    return <LoggedOut login={this.login} />;
  }
}
