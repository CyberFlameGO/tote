import React from 'react';

function wrap(props, comp, type) {
  const ret = {
    ...comp,
    props: {
      ...comp.props,
      'data-offset-key': props.offsetKey,
      children: props.children,
    },
  };

  if (type && type === 'tag') ret.props.onClick = () => props.onClick(props.decoratedText);

  return ret;
}

export const code = p => wrap(p, <code />);
export const em = p => wrap(p, <em />);
export const strong = p => wrap(p, <strong />);
export const del = p => wrap(p, <del />);
export const tag = p => wrap(p, <span className="tag" spellCheck={false} />, 'tag');

/* eslint-disable jsx-a11y/heading-has-content */
export const h1 = p => wrap(p, <h1 />);
export const h2 = p => wrap(p, <h2 />);
export const h3 = p => wrap(p, <h3 />);
export const h4 = p => wrap(p, <h4 />);
export const h5 = p => wrap(p, <h5 />);
export const h6 = p => wrap(p, <h6 />);
/* eslint-enable jsx-a11y/heading-has-content */

