import 'babel/polyfill';
import React from 'react';
import ReactApp from './components/ReactApp.jsx';

React.render(
  <ReactApp />,
  document.getElementById('react-main-mount')
);