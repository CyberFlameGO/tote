import React, { Component } from 'react';
import logo from './logo.svg';
import firebase from 'firebase';
import LoggedIn from '../LoggedIn';

const provider = new firebase.auth.GoogleAuthProvider();

class App extends Component {
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
        });
      }
    });
  }

  login() {
    firebase.auth().signInWithPopup(provider).then((result) => {
      const user = result.user;
      this.setState({
        loggedIn: true,
        user,
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

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.login}>LOGIN</button>
      </div>
    );
  }
}

export default App;
