import React from 'react';
import FlowDemoFactory from './FlowDemo.jsx';
// import FlowDemoFactory from './FlowDemo.jsx';
// import PromiseTasks from '../utils/promisetasks';
// import PromiseFlow from '../utils/promiseflow';
// import GeneratorTasks from '../utils/generatortasks';
// import GeneratorFlow from '../utils/generatorflow';
// import AsyncAwaitFlow from '../utils/asyncawaitflow';

// const PromiseFlowComponent = FlowDemoFactory('promise', PromiseTasks, PromiseFlow);
// const GeneratorFlowComponent = FlowDemoFactory('generator', GeneratorTasks, GeneratorFlow);
// const AsyncAwaitFlowComponent = FlowDemoFactory('generator', PromiseTasks, AsyncAwaitFlow);

export default class ReactApp extends React.Component {
  render() {
    return (
      <section>
        <div className="row">
          <div className="small-12 columns">
            <h1 className="text-center">Design Patterns</h1>
          </div>
          <FlowDemoFactory />
        </div>
      </section>
    )
  }
};