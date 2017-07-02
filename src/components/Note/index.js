import React, { Component } from 'react';
import { shape, func, string, bool } from 'prop-types';
import firebase from 'firebase';
import types from '../../utils/types';
import Editor from '../Editor';
import saveNote from '../../utils/saveNote';
import deleteNote from '../../utils/deleteNote';
import Icon from '../../utils/icons';
import './Note.scss';

export default class Note extends Component {
  static propTypes = {
    match: shape({ params: shape({ noteId: string }) }),
    user: types.user.isRequired,
    online: bool.isRequired,
    updateSearch: func.isRequired,
    notes: types.notes.isRequired,
    loading: bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.focus = this.focus.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.focus();
    }, 100);
  }

  save(editorState) {
    const { user, match } = this.props;
    const { noteId } = match.params;
    saveNote(editorState, user.uid, noteId);
  }

  delete() {
    const { user, match, history } = this.props;
    deleteNote(user.uid, match.params.noteId).then(() => {
      history.push('/');
    });
  }

  focus() {
    if (this.editor && this.editor.editor) this.editor.editor.focus();
  }

  onFocus() {
    const { history, match } = this.props;
    const { noteId } = match.params;

    if (!noteId) {
      const newKey = firebase.database().ref().push().key;
      history.push(`/n/${newKey}`);
      setTimeout(() => {
        this.editor.editor.focus();
      }, 100);
    }
  }

  render() {
    const { user, match, online, updateSearch, notes, loading } = this.props;
    const { noteId } = match.params;
    const text = notes && notes[noteId] ? notes[noteId].text : undefined;

    return (
      <div className="note">
        <div className="note__buttons">
          {text && <button onClick={this.delete}><Icon icon="trash" /></button>}
        </div>
        {!online && <div className="note__offline"><Icon icon="warning" />You are offline! Your changes will be saved when you reconnect.</div>}
        <div className="note__editor">
          {loading && online ? <span className="note__editor__loading">Loading...</span> :
            <Editor
              key={noteId}
              onFocus={this.onFocus}
              updateSearch={updateSearch}
              ref={(r) => { this.editor = r; }}
              save={this.save}
              user={user}
              noteId={noteId}
              text={text}
            />}
        </div>
      </div>
    );
  }
}
