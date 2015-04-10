import React from 'react';
import DemoCanvas from './DemoCanvas.jsx';
import FlowContext from '../utils/contexts/flowcontext';

export default React.createClass({
  // componentDidMount() {
  //   // this.setState({
  //     // demoState: 'promise',
  //     // flowContext: new FlowContext('promise')
  //   // });
  // },
  changeFlowContext(stateType) {
    return () => {
      this.state.flowContext.changeFlow(stateType);
    };
  },
  changeFlowStrategy(flowStrategy) {
    return () => {
      this.state.flowContext.changeFlowStrategy(flowStrategy);
    };
  },
  getInitialState() {
    return {
      demoState: 'promise',
      flowContext: new FlowContext()
    };
  },
  render() {

    return (
      <div className="row">
        <div className="row">
          <div className="small-6 columns">
            <ul className="button-group radius left">
              <li><button className="button"
                onClick={this.changeFlowStrategy('sequence')}
              >Sequential</button></li>
              <li><button className="button"
                onClick={this.changeFlowStrategy('parallel')}
              >Parallel</button></li>
              <li><button className="button"
                onClick={this.changeFlowStrategy('limitedParallel')}
              >Limited Parallel</button></li>
            </ul>
          </div>
          <div className="small-6 columns">
            <ul className="button-group radius right">
              <li><button className="button"
                onClick={this.changeFlowContext('promise')}
              >Promises</button></li>
              <li><button className="button"
                onClick={this.changeFlowContext('generator')}
              >Generators</button></li>
              <li><button className="button"
                onClick={this.changeFlowContext('asyncAwait')}
              >Async Await</button></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="small-5 columns">
            <DemoCanvas flowContext={this.state.flowContext} />
          </div>
          <div className="small-7 columns">
            <h3 className="text-center">Code Examples</h3>
          </div>
        </div>
      </div>
    )
  }
});