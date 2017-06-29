import React, { Component } from 'react';
import { string } from 'prop-types';
import { Editor as DraftEditor, ContentState, EditorState, CompositeDecorator } from 'draft-js';
import types from '../../utils/types';
import * as strats from './strats';
import * as comps from './comps';
import MultiDecorator from 'draft-js-multidecorators';
import prismjs from './prism';
import checkReturnForState from './utils/checkReturnForState';
import checkCharacterForState from './utils/checkCharacterForState';
import { stateFromMarkdown } from 'draft-js-import-markdown';

export default class Editor extends Component {
  static propTypes = {
    user: types.user.isRequired,
    noteId: string,
    text: string,
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
        { strategy: strats.h6, component: comps.h6 },
        { strategy: strats.h5, component: comps.h5 },
        { strategy: strats.h4, component: comps.h4 },
        { strategy: strats.h3, component: comps.h3 },
        { strategy: strats.h2, component: comps.h2 },
        { strategy: strats.h1, component: comps.h1 },
      ]),
    ]);


    if (props.text) {
      const contentState = stateFromMarkdown(props.text);
      const editorState = EditorState.createWithContent(contentState, this.compositeDecorator);

      this.state = { editorState };
    } else {
      const contentState = ContentState.createFromText('');
      const editorState = EditorState.createWithContent(contentState, this.compositeDecorator);

      this.state = { editorState };
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.noteId !== this.props.noteId) {
      const contentState = ContentState.createFromText(newProps.text || '');
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

  render() {
    const { editorState } = this.state;
    return (
      <DraftEditor
        handleBeforeInput={this.handleBeforeInput}
        handleReturn={this.handleReturn}
        editorState={editorState}
        onChange={this.onChange}
        spellCheck
        ref={(r) => { this.editor = r; }}
      />
    );
  }
}
