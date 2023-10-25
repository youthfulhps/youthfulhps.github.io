import React from 'react';
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';

deckDeckGoHighlightElement();

export const PostContainer = ({ html }) => (
  <div className="post-container" dangerouslySetInnerHTML={{ __html: html }} />
);
