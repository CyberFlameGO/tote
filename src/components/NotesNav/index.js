import React, { Component } from 'react';
import { bool, func, string, object } from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import firebase from 'firebase';
import { convertFromRaw } from 'draft-js';
import Icon from '../../utils/icons';
import { timeSince, truncate } from '../../utils/helpers';
import { markdown } from 'markdown';
import './NotesNav.scss';

export default class NotesNav extends Component {
  static propTypes = {
    notes: object,
    search: string.isRequired,
    updateSearch: func.isRequired,
    open: bool.isRequired,
  }

  render() {
    const { notes, open } = this.props;
    const { search, updateSearch } = this.props;
    // const noteKeys = sort(Object.keys(notes || {}), notes, 'lastModified');

    const noteKeys = Object.keys(notes || {});
    const newKey = firebase.database().ref().push().key;

    const filteredNotes = search === '' ? noteKeys : noteKeys.filter(noteKey => {
      const re = new RegExp(search, 'i');
      const { text } = notes[noteKey];
      const plainText = convertFromRaw({
        ...text,
        entityMap: text.entityMap || {},
      }).getPlainText();
      return plainText.search(re) !== -1;
    });

    return (
      <nav className={`notes-nav ${open ? 'is-open' : ''}`}>
        <div className="notes-nav__buttons">
          <div className="notes-nav__search-wrapper">
            <input placeholder="Search..." value={search} onChange={e => updateSearch(e.target.value)} className="notes-nav__search" type="text" />
            {search !== '' && <button onClick={() => updateSearch('')} className="notes-nav__search-clear"><Icon icon="cross" size={10} /></button>}
          </div>
          <Link title="New Note" onClick={() => updateSearch('')} className="notes-nav__buttons__new" to={`/n/${newKey}`}><Icon icon="addFile" /></Link>
        </div>
        <ul className="notes-nav__list">
          {filteredNotes.map(noteId => {
            const { lastModified, text } = notes[noteId];
            const contentState = convertFromRaw({
              ...text,
              entityMap: text.entityMap || {},
            });
            const plainText = contentState.getPlainText();
            
            const label = markdown.toHTML(truncate(plainText, 100, '')) || '';
            return (
              <li className="notes-nav__list-item" key={noteId}>
                <NavLink
                  activeClassName="is-active"
                  className="notes-nav__link"
                  to={`/n/${noteId}`}
                  dangerouslySetInnerHTML={{ __html: label }}
                />
                <span className="notes-nav__time">{timeSince(lastModified)}</span>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
