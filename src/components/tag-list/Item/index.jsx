import React from 'react';
import { TYPE_CATEGORY } from '../../../constants';

function Item({ tag }) {
  return (
    <li className={`item ${tag === TYPE_CATEGORY.BLOG ? 'blog' : 'til'}`}>
      {tag}
    </li>
  );
}

export default Item;
