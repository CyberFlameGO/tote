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
export const strongEm = p => <strong data-offset-key={p.offsetKey}><em>{p.children}</em></strong>;
export const del = p => wrap(p, <del />);
export const tag = p => wrap(p, <span className="tag" spellCheck={false} />, 'tag');

