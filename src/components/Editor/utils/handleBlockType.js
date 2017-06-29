import changeCurrentBlockType from './changeCurrentBlockType';

const handleBlockType = (editorState, character) => {
  const currentSelection = editorState.getSelection();
  const key = currentSelection.getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey(key).getText();
  const position = currentSelection.getAnchorOffset();
  const line = [text.slice(0, position), character, text.slice(position)].join('');

  let matchArr = line.match(/^[*-] (.*)$/);
  if (matchArr) {
    return changeCurrentBlockType(editorState, 'unordered-list-item', matchArr[1]);
  }
  matchArr = line.match(/^[\d]\. (.*)$/);
  if (matchArr) {
    return changeCurrentBlockType(editorState, 'ordered-list-item', matchArr[1]);
  }
  matchArr = line.match(/^> (.*)$/);
  if (matchArr) {
    return changeCurrentBlockType(editorState, 'blockquote', matchArr[1]);
  }
  return editorState;
};

export default handleBlockType;