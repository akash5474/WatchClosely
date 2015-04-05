import React from 'react';
import PromiseFlow from './PromiseFlow.jsx';
import GeneratorFlow from './GeneratorFlow.jsx';
// import MemoryStats from 'memory-stats';

export default class ReactApp extends React.Component {
  // constructor() {
  //   super();
  //   var stats = new MemoryStats();

  //   stats.domElement.style.position = 'fixed';
  //   stats.domElement.style.right        = '0px';
  //   stats.domElement.style.bottom       = '0px';

  //   document.body.appendChild( stats.domElement );

  //   requestAnimationFrame(function rAFloop(){
  //       stats.update();
  //       requestAnimationFrame(rAFloop);
  //   });
  // }
  render() {
    return (
      <section>
        <div className="row">
          <div className="small-12 columns">
            <h1 className="text-center">Design Patterns</h1>
          </div>
          <PromiseFlow />
          <GeneratorFlow />
        </div>
      </section>
    )
  }
};