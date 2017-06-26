import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Note from '../../components/Note';  
import NotesNav from '../../components/NotesNav';  
import types from '../../utils/types';
import firebase from 'firebase';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './LoggedIn.scss';

export default class LoggedIn extends Component {
  static propTypes = {
    user: types.user.isRequired,
    logout: PropTypes.func.isRequired,
  }

  state = { notes: {} }

  componentDidMount() {
    const { uid } = this.props.user;
    const notesRef = firebase.database().ref(`users/${uid}/notes`);
    notesRef.on('value', (snapshot) => {
      this.setState({ notes: snapshot.val() });
    });
  }

  render() {
    const { user, online } = this.props;
    return (
      <Router>
        <main className="main">
          <nav className="nav">
            <button onClick={this.props.logout}>LOGOUT</button>
          </nav>
          <NotesNav uid={user.uid} notes={this.state.notes} />

          <Route exact path="/:noteId?" render={(p) => <Note online={online} user={user} {...p} />} />
        </main>
      </Router>
    );
  }
}
