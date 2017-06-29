import leaveList from './leaveList';

export default function checkReturnForState(editorState, ev) {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const type = currentBlock.getType();
  const text = currentBlock.getText();

  if (/-list-item$/.test(type) && text === '') {
    newEditorState = leaveList(editorState);
  }

  return newEditorState;
}