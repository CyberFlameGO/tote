import React, { Component } from 'react';
import { func } from 'prop-types';
import types from '../../utils/types';

export default class Nav extends Component {
  static propTypes = {
    notes: types.notes.isRequired,
    logout: func.isRequired,
  }

  constructor(props) {
    super(props);
    this.reduceTagsToTree = this.reduceTagsToTree.bind(this);
    this.renderTags = this.renderTags.bind(this);
  }

  reduceTagsToTree(prev, curr) {
    if (curr.includes('/')) {
      const nested = curr.split('/');
      return {
        ...prev,
        [nested[0]]: {
          ...nested.slice(1).reduce(this.reduceTagsToTree, {}),
        }
      }
    }
    return { ...prev, [curr]: curr };
  }

  flattenTags(notes) {
    const noteKeys = Object.keys(notes);

    // Create an array of tag array, and filter out missing arrays
    const tagsMap = noteKeys.map(key => notes[key].tags).filter(a => a);

    // Flatten arrays into one array of strings, then convert to Set to remove dupes
    const tagSet = new Set(tagsMap.reduce((prev, curr) => prev.concat(curr), []));
    
    // Convert back to an array and return
    return Array.from(tagSet);
  }

  renderTags(tagTree) {
    const topLevelTags = Object.keys(tagTree);
    return topLevelTags.map(tag => {
      if (typeof tagTree[tag] === 'string') return <li className="nav__tag" key={tag}>{tag.startsWith('#') ? tag.substr(1) : tag}</li>;
      return (
        <li key={tag} className="nav__tag has-children">
          {tag}
          <ul className="nav__tagTree is-nested">
            {this.renderTags(tagTree[tag])}
          </ul>
        </li>
      )
    });
  }

  render() {
    const { notes } = this.props;
    const tags = this.flattenTags(notes);
    const tagTree = tags.reduce(this.reduceTagsToTree, {});
    console.log(tagTree);

    return (
      <nav className="nav">
        <h1>Welcome to the Nav component!</h1>
        <ul className="nav__tagTree">
          {this.renderTags(tagTree)}
        </ul>
        <button onClick={this.props.logout}>LOGOUT</button>
      </nav>
    );
  }
}
