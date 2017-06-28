import React, { Component } from 'react';
import { shape, func, string, bool } from 'prop-types';
import types from '../../utils/types';
import Editor from '../Editor';
import firebase from 'firebase';
import saveNote from '../../utils/saveNote';
import Icon from '../../utils/icons';
import './Note.scss';

const update = (that, uid, noteId) => {
  that.setState({ loading: true }, () => {
    const refStr = `users/${uid}/notes/${noteId}`;
    firebase.database().ref(refStr).once('value').then((snap) => {
      try {
        that.setState({ text: snap.val().text, loading: false, noteId });
      } catch (e) {
        that.setState({ text: '', loading: false, noteId });
      }
    });
  });
}

export default class Note extends Component {
  static propTypes = {
    match: shape({ params: shape({ noteId: string }) }),
    user: types.user.isRequired,
    online: bool.isRequired,
    updateSearch: func.isRequired,
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.focus = this.focus.bind(this);
    this.state = { loading: false };
  }

  componentDidMount() {
    const { user, match } = this.props;
    const { noteId } = match.params;
    update(this, user.uid, noteId);
    this.focus();
  }

  componentWillReceiveProps(newProps) {
    const { user, match } = this.props;
    const { noteId } = newProps.match.params;
    if (noteId && noteId !== match.params.noteId) {
      this.setState({ loading: true }, () => {
        update(this, user.uid, noteId);
        setTimeout(() => {
          this.focus();
        }, 100);
      });
    }
  }

  save(editorState) {
    const { user, match } = this.props;
    saveNote(editorState, user.uid, match.params.noteId);
  }

  focus() {
    if (this.editor && this.editor.editor) this.editor.editor.focus();
  }

  render() {
    const { loading, text } = this.state;
    const { user, match, online, updateSearch } = this.props;
    const { noteId } = match.params;

    return (
      <div className="note">
        {!online && <div className="note__offline"><Icon icon="warning" />You are offline! Your changes will be saved when you reconnect.</div>}
        <div className="note__editor">
          {loading && online ? <span className="note__editor__loading">Loading...</span> :
            <Editor
              updateSearch={updateSearch}
              ref={(r) => { this.editor = r; }}
              save={this.save}
              user={user}
              noteId={noteId}
              text={text}
            />
          }
        </div>
      </div>
    );
  }
}
