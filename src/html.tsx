import React from 'react';

type HTMLProps = {
  htmlAttributes?: React.HTMLAttributes<HTMLHtmlElement>;
  headComponents?: React.ReactNode[];
  bodyAttributes?: React.HTMLAttributes<HTMLBodyElement>;
  preBodyComponents?: React.ReactNode[];
  body?: string;
  postBodyComponents?: React.ReactNode[];
};

function HTML({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}: HTMLProps) {
  return (
    <html {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, minimum-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {preBodyComponents}
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: body || '' }}
        />
        {postBodyComponents}
      </body>
    </html>
  );
}

export default HTML;
