import React, { Component } from 'react';
import { shape, func, string, bool } from 'prop-types';
import firebase from 'firebase';
import types from '../../utils/types';
import Editor from '../Editor';
import saveNote from '../../utils/saveNote';
import deleteNote from '../../utils/deleteNote';
import Icon from '../../utils/icons';
import './Note.scss';
import { copy } from '../../utils/helpers';

export default class Note extends Component {
  static propTypes = {
    match: shape({ params: shape({ noteId: string }) }),
    user: types.user.isRequired,
    online: bool.isRequired,
    updateSearch: func.isRequired,
    notes: types.notes.isRequired,
    loading: bool.isRequired,
    isPrivate: bool,
  }

  static defaultProps = {
    isPrivate: false,
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.focus = this.focus.bind(this);
    this.share = this.share.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.focus();
    }, 100);
  }

  save(editorState, isPrivate) {
    const { user, match } = this.props;
    const { noteId } = match.params;
    const privacy = isPrivate !== undefined ? isPrivate : this.props.isPrivate;
    saveNote(editorState, user, noteId, privacy, isPrivate !== this.props.isPrivate);
  }

  delete() {
    const { user, match, isPrivate, history } = this.props;
    deleteNote(user.uid, match.params.noteId, isPrivate).then(() => {
      history.push('/');
    });
  }

  focus() {
    if (this.editor && this.editor.editor) this.editor.editor.focus();
  }

  share() {
    const { user, match } = this.props;
    const site = window.location.origin;
    const link = `${site}/u/${user.uid}/${match.params.noteId}`;
    copy(link);
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

  togglePrivate() {
    const { isPrivate } = this.props;
    this.save(this.editor.state.editorState, !isPrivate);
  }

  render() {
    const { user, match, online, updateSearch, notes, isPrivate, loading } = this.props;
    const { noteId } = match.params;
    const text = notes && notes[noteId] ? notes[noteId].text : undefined;

    return (
      <div className="note">
        {!online && <div className="note__offline"><Icon icon="warning" />You are offline! Your changes will be saved when you reconnect.</div>}
        <div className="note__buttons">
          {text && <button className="note__buttons__btn" onClick={this.delete} title="Delete"><Icon icon="trash" /></button>}
          {text && <button
            className={`note__buttons__btn ${isPrivate ? 'is-private' : ''}`}
            onClick={() => this.togglePrivate(isPrivate)}
            title={isPrivate ? 'Private' : 'Public'}
          >
            <Icon icon={isPrivate ? 'lock' : 'unlock'} />
          </button>}
          {text && <button className="note__buttons__btn" onClick={this.share} title="Share">
            <Icon icon="sync" />
          </button>}
        </div>
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
