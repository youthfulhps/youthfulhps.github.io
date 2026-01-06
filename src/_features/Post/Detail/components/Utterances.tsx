import React, { useEffect, useRef } from 'react';

import * as Dom from '@shared/utils/dom';
import { THEME } from '@shared/constants';

const src = 'https://utteranc.es/client.js';
const branch = 'master';
const DARK_THEME = 'photon-dark';
const LIGHT_THEME = 'github-light';

type UtterancesProps = {
  repo: string;
};

function Utterances({ repo }: UtterancesProps) {
  const rootElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootElm.current) return;

    const isDarkTheme = Dom.hasClassOfBody(THEME.DARK);
    const utterances = document.createElement('script');
    const utterancesConfig: Record<string, string | boolean> = {
      src,
      repo,
      branch,
      theme: isDarkTheme ? DARK_THEME : LIGHT_THEME,
      label: 'comment',
      async: true,
      'issue-term': 'pathname',
      crossorigin: 'anonymous',
    };

    Object.entries(utterancesConfig).forEach(([key, value]) => {
      utterances.setAttribute(key, String(value));
    });
    rootElm.current.appendChild(utterances);
  }, [repo]);

  return <div className="utterances" ref={rootElm} />;
}

export default Utterances;
