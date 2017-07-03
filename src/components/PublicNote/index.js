import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import { timeSince } from '../../utils/helpers';
import firebase from 'firebase';
import Editor from '../Editor';

export default class PublicNote extends Component {
  static propTypes = {
    match: shape({ params: shape({
      noteId: string.isRequired,
      uid: string.isRequired,
    }).isRequired }).isRequired,
  }
  
  state = { loading: true }

  componentDidMount() {
    const { noteId, uid } = this.props.match.params;
    const noteRef = `users/${uid}/notes/public/${noteId}`;
    firebase.database().ref(noteRef).once('value', snapshot => {
      const note = snapshot.val();
      this.setState({ note, loading: false });
    });
  }

  render() {
    const { loading, note } = this.state;
    const { noteId } = this.props.match.params;

    return (
      <div className="note">
        {!loading &&
          <div className="note__owner">
            <span>{note.author.displayName}</span>
            <span>Last updated {timeSince(note.lastModified)} ago</span>
          </div>
        }
        <div className="note__editor">
          {loading ? <span className="note__editor__loading">Loading...</span> :
            <Editor
              key={noteId}
              onFocus={this.onFocus}
              ref={(r) => { this.editor = r; }}
              noteId={noteId}
              text={note.text}
              readOnly
            />}
        </div>
      </div>
    );
  }
}
