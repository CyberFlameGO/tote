import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import firebase from 'firebase';
import { markdown } from 'markdown';
import Icon from '../../utils/icons';
import './NotesNav.scss';

// eslint-disable-next-line no-unused-vars
function sort(arr, obj, sortBy) {
  return arr.sort((a, b) => {
    if (obj[a][sortBy] < obj[b][sortBy])
      return 1;
    if (obj[a][sortBy] > obj[b][sortBy])
      return -1;
    return 0;
  });
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return `${interval}y`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval}m`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval}d`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval}h`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval}m`;

  return Math.floor(seconds) + 's';
}

export default class NotesNav extends Component {
  static propTypes = {
    notes: PropTypes.object,
    uid: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    updateSearch: PropTypes.func.isRequired,
  }

  render() {
    const { uid, notes } = this.props;
    const { search, updateSearch } = this.props;
    // const noteKeys = sort(Object.keys(notes || {}), notes, 'lastModified');

    const noteKeys = Object.keys(notes || {});
    const newKey = firebase.database().ref(`/users/${uid}/notes/`).push().key;

    const filteredNotes = search === '' ? noteKeys : noteKeys.filter(noteKey => {
      const re = new RegExp(search, 'i');
      return notes[noteKey].text.search(re) !== -1;
    });

    return (
      <nav className="notes-nav">
        <div className="notes-nav__buttons">
          <input placeholder="Search..." value={search} onChange={e => updateSearch(e.target.value)} className="notes-nav__search" type="text" />
          <Link title="New Note" onClick={() => this.setState({ search: '' })} className="notes-nav__buttons__new" to={`/${newKey}`}><Icon icon="pencil" /></Link>
        </div>
        <ul className="notes-nav__list">
          {filteredNotes.map(noteId => {
            return (
              <li className="notes-nav__list-item" key={noteId}>
                <NavLink activeClassName="is-active" className="notes-nav__link" to={`/${noteId}`} dangerouslySetInnerHTML={{ __html: markdown.toHTML(notes[noteId].text) }} />
                <span className="notes-nav__time">{timeSince(notes[noteId].lastModified)}</span>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
