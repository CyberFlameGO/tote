import handleBlockType from './handleBlockType';

export default function checkCharacterForState(editorState, character) {
  let newEditorState = handleBlockType(editorState, character);
  return newEditorState;
}