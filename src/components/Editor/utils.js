import firebase from 'firebase';

/**
 * Saves a note to the firebase database
 * @param {object} editorState - DraftJS Editor State
 * @param {string} uid - Firebase user unique id
 * @param {string} noteId - Note's uid
 */
export function saveNote(editorState, uid, noteId) {
  const db = firebase.database();
  const refStr = `users/${uid}/notes/${noteId}`;

  return db.ref(refStr).set({
    lastModified: firebase.database.ServerValue.TIMESTAMP,
    text: editorState.getCurrentContent().getPlainText(),
  }).then(() => noteId);
}
