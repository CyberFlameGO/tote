import React, { Component } from 'react';
import { string, shape, array } from 'prop-types';
import { Editor as DraftEditor, ContentState, EditorState, convertFromRaw, CompositeDecorator } from 'draft-js';
import types from '../../utils/types';
import * as strats from './strats';
import * as comps from './comps';
import MultiDecorator from 'draft-js-multidecorators';
import prismjs from './prism';
import checkReturnForState from './utils/checkReturnForState';
import checkCharacterForState from './utils/checkCharacterForState';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { copy } from '../../utils/helpers';

export default class Editor extends Component {
  static propTypes = {
    user: types.user.isRequired,
    noteId: string,
    text: shape({
      blocks: array,
    }),
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

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

    const contentState = props.text ? convertFromRaw({
        ...props.text,
        entityMap: props.text.entityMap || {},
      }) : ContentState.createFromText('');

    const editorState = EditorState.createWithContent(contentState, this.compositeDecorator);
    this.state = { editorState };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.text === undefined && newProps.text !== undefined) {
      const contentState = convertFromRaw({
          ...newProps.text,
          entityMap: newProps.text.entityMap || {},
        });

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

  handleKeyDown(e) {
    if (e.which === 91) this.setState({ ctrl: true });
    if (e.which === 67 && this.state.ctrl) {
      e.preventDefault();
      const text = stateToMarkdown(this.state.editorState.getCurrentContent());
      copy(text);
    }
  }

  handleKeyUp(e) {
    if (e.which === 91) this.setState({ ctrl: false });
  }

  render() {
    const { editorState } = this.state;
    return (
      <div
        style={{ height: '100%' }}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      >
        <DraftEditor
          handleBeforeInput={this.handleBeforeInput}
          handleReturn={this.handleReturn}
          editorState={editorState}
          onChange={this.onChange}
          spellCheck
          ref={(r) => { this.editor = r; }}
        />
      </div>
    );
  }
}
