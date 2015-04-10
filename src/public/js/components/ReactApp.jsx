import React from 'react';
import FlowDemoFactory from './FlowDemo.jsx';

export default class ReactApp extends React.Component {
  render() {
    return (
      <section>
        <div className="row">
          <div className="small-12 columns">
            <h1 className="text-center">Asynchronous Control Flow</h1>
          </div>
          <FlowDemoFactory />
        </div>
      </section>
    )
  }
};