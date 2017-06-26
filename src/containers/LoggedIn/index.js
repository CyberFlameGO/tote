import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Note from '../../components/Note';  
import NotesNav from '../../components/NotesNav';  
import Nav from '../../components/Nav';  
import types from '../../utils/types';
import firebase from 'firebase';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './LoggedIn.scss';

export default class LoggedIn extends Component {
  static propTypes = {
    user: types.user.isRequired,
    logout: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }

  state = { notes: {}, search: '' }

  componentDidMount() {
    const { uid } = this.props.user;
    const notesRef = firebase.database().ref(`users/${uid}/notes`);
    notesRef.on('value', (snapshot) => {
      this.setState({ notes: snapshot.val() });
    });
  }

  search(search) {
    this.setState({ search });
  }

  render() {
    const { user, online } = this.props;
    const { search } = this.state;

    return (
      <Router>
        <main className="main">
          <Nav notes={this.state.notes} logout={this.props.logout} updateSearch={this.search} />
          <NotesNav uid={user.uid} notes={this.state.notes} updateSearch={this.search} search={search} />

          <Route exact path="/:noteId?" render={(p) => <Note online={online} user={user} {...p} />} />
        </main>
      </Router>
    );
  }
}
