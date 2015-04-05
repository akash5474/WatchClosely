import React from 'react';
import FlowDemoFactory from './FlowDemo.jsx';
import PromiseTasks from '../utils/promisetasks';
import PromiseFlow from '../utils/promiseflow';

const PromiseFlowComponent = FlowDemoFactory(PromiseTasks, PromiseFlow);

export default class ReactApp extends React.Component {
  render() {
    return (
      <section>
        <div className="row">
          <div className="small-12 columns">
            <h1 className="text-center">Design Patterns</h1>
          </div>
          <PromiseFlowComponent />
        </div>
      </section>
    )
  }
};