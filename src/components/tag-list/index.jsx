import React from 'react';
import Item from './Item';
import './index.scss';

function TagList({ tagList }) {
  return (
    <ul className={'tag-list'}>
      {tagList.map(tag => (
        <Item key={tag} tag={tag} />
      ))}
    </ul>
  );
}

export default TagList;
