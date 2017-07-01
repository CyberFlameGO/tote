import firebase from 'firebase';
import { convertToRaw } from 'draft-js';
import { regs } from '../components/Editor/strats';

/**
 * Saves a note to the firebase database
 * @param {object} editorState - DraftJS Editor State
 * @param {string} uid - Firebase user unique id
 * @param {string} noteId - Note's uid
 */
export default function saveNote(editorState, uid, noteId) {
  const db = firebase.database();
  const refStr = `users/${uid}/notes/${noteId}`;
  const content = editorState.getCurrentContent();
  const text = convertToRaw(content);
  const textString = content.getPlainText();
  const tagSet = new Set(textString.match(regs.TAG));

  return db.ref(refStr).set({
    lastModified: firebase.database.ServerValue.TIMESTAMP,
    text,
    tags: Array.from(tagSet),
  }).then(() => noteId);
}
