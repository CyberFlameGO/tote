import firebase from 'firebase';
import { convertToRaw } from 'draft-js';
import { regs } from '../components/Editor/strats';

/**
 * Saves a note to the firebase database
 * @param {object} editorState - DraftJS Editor State
 * @param {string} uid - Firebase user unique id
 * @param {string} noteId - Note's uid
 * @param {boolean} isPrivate - The Note is public or private
 */
export default function saveNote(editorState, { uid, displayName }, noteId, isPrivate, switching) {
  const dir = isPrivate ? 'private' : 'public';
  const db = firebase.database();
  const refStr = `users/${uid}/notes/${dir}/${noteId}`;
  const content = editorState.getCurrentContent();
  const text = convertToRaw(content);
  const textString = content.getPlainText();
  const tagSet = new Set(textString.match(regs.TAG));

  if (switching) {
    const delDir = isPrivate ? 'public' : 'private';
    const noteToDelete = `users/${uid}/notes/${delDir}/${noteId}`;
    firebase.database().ref(noteToDelete).remove();
  }

  return db.ref(refStr).set({
    lastModified: firebase.database.ServerValue.TIMESTAMP,
    text,
    author: { uid, displayName },
    tags: Array.from(tagSet),
  }).then(() => noteId);
}
