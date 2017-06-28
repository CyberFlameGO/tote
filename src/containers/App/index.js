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
    this.detectConnection = this.detectConnection.bind(this);
  }

  state = {
    loading: true,
    loggedIn: false,
    online: true,
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user, err) => {
      if (err) {
        console.error(err);
        this.setState({ loading: false });
      }

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

    this.detectConnection();
  }

  detectConnection() {
    const connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        if (!this.state.online) console.info('Now connected! 🎉');
        this.setState({ online: true });
      } else if (!this.state.loading) {
        console.info('Disconnected. 😭')
        this.setState({ online: false });
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
        console.error(error);
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
    const { loading, loggedIn, user, online } = this.state;

    if (loading) return null;
    if (loggedIn && user) return <LoggedIn online={online} user={user} logout={this.logout} />;
    return <LoggedOut online={online} login={this.login} />;
  }
}
