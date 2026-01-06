const React = require('react');

exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
    className: 'dark',
  });
};
