import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Note from '../../components/Note';  
import PublicNote from '../../components/PublicNote';  
import NotesNav from '../../components/NotesNav';  
import Nav from '../../components/Nav';  
import types from '../../utils/types';
import firebase from 'firebase';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './LoggedIn.scss';

export default class LoggedIn extends Component {
  static propTypes = {
    user: types.user.isRequired,
    logout: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.closeAnyNav = this.closeAnyNav.bind(this);
    this.openNav = this.openNav.bind(this);
    this.openNotesNav = this.openNotesNav.bind(this);
  }

  state = { public: {}, private: {}, loading: true, search: '', notesNav: false, nav: false }

  componentDidMount() {
    const { uid } = this.props.user;

    const publicRef = firebase.database().ref(`users/${uid}/notes/public`);
    publicRef.on('value', (snapshot) => {
      this.setState({ public: snapshot.val(), loading: false });
    });

    const privateRef = firebase.database().ref(`users/${uid}/notes/private`);
    privateRef.on('value', (snapshot) => {
      this.setState({ private: snapshot.val(), loading: false });
    });
  }

  search(search) { this.setState({ search }); }

  openNotesNav() { this.setState({ notesNav: true, nav: false }); }
  openNav() { this.setState({ notesNav: false, nav: true }); }
  closeAnyNav() { this.setState({ notesNav: false, nav: false }); }

  render() {
    const { user, online } = this.props;
    const { search, nav, notesNav, loading } = this.state;
    const notes = { ...this.state.private, ...this.state.public };

    return (
      <Router>
        <main className="main">
          <Nav open={nav} notes={notes} logout={this.props.logout} updateSearch={this.search} />
          <NotesNav open={notesNav} notes={notes} updateSearch={this.search} search={search} />

          <div className="mobile-nav">
            <button className="mobile-nav__btn" onClick={this.openNav}>Tags</button>
            <button className="mobile-nav__btn" onClick={this.openNotesNav}>Notes</button>
          </div>

          <div className={`mobile-overlay ${nav || notesNav ? 'is-open' : ''}`} onClick={this.closeAnyNav} />
          <Switch>
            <Route
              exact
              path="(/n)?/:noteId?"
              render={p => {
                const { noteId } = p.match.params;
                const isPrivate = Object.prototype.hasOwnProperty.call(this.state.private || {}, noteId);
                return (
                  <Note
                    isPrivate={isPrivate}
                    notes={notes}
                    loading={loading}
                    online={online}
                    updateSearch={this.search}
                    user={user}
                    {...p}
                  />
                );
              }}
            />

            <Route
              exact
              path="/u/:uid/:noteId"
              render={p => <PublicNote loading={loading} {...p} />}
            />
          </Switch>
        </main>
      </Router>
    );
  }
}
