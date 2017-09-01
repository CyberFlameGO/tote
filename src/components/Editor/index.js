import React, { Component } from 'react';
import { string, shape, array, func, bool } from 'prop-types';
import { Editor as DraftEditor, ContentState, EditorState, CompositeDecorator } from 'draft-js';
import MultiDecorator from 'draft-js-multidecorators';
import * as strats from './strats';
import * as comps from './comps';
import prismjs from './prism';
import checkReturnForState from './utils/checkReturnForState';
import checkCharacterForState from './utils/checkCharacterForState';
import { fromRaw } from '../../utils/helpers';

export default class Editor extends Component {
  static propTypes = {
    onFocus: func,
    noteId: string,
    readOnly: bool,
    text: shape({
      blocks: array,
    }),
  }

  static defaultProps = {
    readOnly: false,
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleReturn = this.handleReturn.bind(this);

    this.compositeDecorator = new MultiDecorator([
      prismjs,
      new CompositeDecorator([
        { strategy: strats.code, component: comps.code },
        { strategy: strats.del, component: comps.del },
        { strategy: strats.strongEm, component: comps.strongEm },
        { strategy: strats.strong, component: comps.strong },
        { strategy: strats.em, component: comps.em },
        { strategy: strats.tag, component: comps.tag, props: { onClick: props.updateSearch } },
      ]),
    ]);

    const contentState = props.text ? fromRaw(props.text) : ContentState.createFromText('');

    const editorState = EditorState.createWithContent(contentState, this.compositeDecorator);
    this.state = { editorState };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.text === undefined && newProps.text !== undefined) {
      const contentState = fromRaw(newProps.text);

      const editorState = EditorState.createWithContent(contentState, this.compositeDecorator);
      this.setState({ editorState });
    }
  }

  onChange(editorState) {
    const oldState = this.state.editorState;
    this.setState({ editorState }, () => {
      const current = oldState.getCurrentContent();
      const changed = editorState.getCurrentContent();
      if (current !== changed) {
        this.props.save(editorState);
      }
    });
  }

  handleBeforeInput(character, editorState) {
    if (character !== ' ') {
      return 'not-handled';
    }
    const newEditorState = checkCharacterForState(editorState, character);
    if (editorState !== newEditorState) {
      this.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleReturn(ev, editorState) {
    const newEditorState = checkReturnForState(editorState, ev);
    if (editorState !== newEditorState) {
      this.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  onFocus() {
    console.log('Focus!');
  }

  render() {
    const { editorState } = this.state;
    const { onFocus, readOnly } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <DraftEditor
          handleBeforeInput={this.handleBeforeInput}
          handleReturn={this.handleReturn}
          editorState={editorState}
          onFocus={onFocus}
          readOnly={readOnly}
          onChange={this.onChange}
          spellCheck
          ref={(r) => { this.editor = r; }}
        />
      </div>
    );
  }
}
