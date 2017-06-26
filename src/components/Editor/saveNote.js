import firebase from 'firebase';
import { regs } from './strats';

/**
 * Saves a note to the firebase database
 * @param {object} editorState - DraftJS Editor State
 * @param {string} uid - Firebase user unique id
 * @param {string} noteId - Note's uid
 */
export default function saveNote(editorState, uid, noteId) {
  const db = firebase.database();
  const refStr = `users/${uid}/notes/${noteId}`;
  const text = editorState.getCurrentContent().getPlainText();
  const tagSet = new Set(text.match(regs.TAG));

  return db.ref(refStr).set({
    lastModified: firebase.database.ServerValue.TIMESTAMP,
    text,
    tags: Array.from(tagSet),
  }).then(() => noteId);
}
