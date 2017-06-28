import firebase from 'firebase';

/**
 * Deletes a note from the firebase database
 * @param {string} uid - Firebase user unique id
 * @param {string} noteId - Note's uid
 */
export default function deleteNote(uid, noteId) {
  const db = firebase.database();
  const refStr = `users/${uid}/notes/${noteId}`;

  return db.ref(refStr).remove().then(() => noteId);
}
