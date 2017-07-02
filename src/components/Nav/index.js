import React, { Component } from 'react';
import { func, bool } from 'prop-types';
import types from '../../utils/types';
import { truncate } from '../../utils/helpers';
import './Nav.scss';

export default class Nav extends Component {
  static propTypes = {
    notes: types.notes.isRequired,
    updateSearch: func.isRequired,
    logout: func.isRequired,
    open: bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.reduceTagsToTree = this.reduceTagsToTree.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.search = this.search.bind(this);
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
    const noteKeys = Object.keys(notes || {});

    // Create an array of tag array, and filter out missing arrays
    const tagsMap = noteKeys.map(key => notes[key].tags).filter(a => a);

    // Flatten arrays into one array of strings, then convert to Set to remove dupes
    const tagSet = new Set(tagsMap.reduce((prev, curr) => prev.concat(curr), []));
    
    // Convert back to an array and return
    return Array.from(tagSet);
  }

  renderTags(tagTree, parentTag) {
    const topLevelTags = Object.keys(tagTree);
    return topLevelTags.map(tag => {
      const tagStr = tag.startsWith('#') ? tag.substr(1) : tag;
      const truncateLength = parentTag ? 8 : 12;
      const tagLabel = <span className="nav__tag__label">{truncate(tagStr, truncateLength)}</span>;
      if (typeof tagTree[tag] === 'string') {
        const searchTag = parentTag ? `${parentTag}/${tag}` : tag;
        return <li className="nav__tag" key={tag} onClick={(e) => this.search(e, searchTag)}>{tagLabel}</li>;
      }
      return (
        <li key={tag} className="nav__tag has-children" onClick={(e) => this.search(e, tag)}>
          {tagLabel}
          <ul className="nav__tagTree is-nested">
            {this.renderTags(tagTree[tag], tag)}
          </ul>
        </li>
      )
    });
  }

  search(e, tag) {
    e.stopPropagation();
    this.props.updateSearch(tag);
  }

  render() {
    const { notes, open } = this.props;
    const tags = this.flattenTags(notes);
    const tagTree = tags.reduce(this.reduceTagsToTree, {});

    return (
      <nav className={`nav ${open ? 'is-open' : ''}`}>
        <ul className="nav__tagTree">
          {this.renderTags(tagTree)}
        </ul>
        <button className="nav__logout" onClick={this.props.logout}>Logout</button>
      </nav>
    );
  }
}
