import React from 'react';
import DemoCanvas from './DemoCanvas.jsx';
import Rainbow from '../rainbow-custom.min';
import FlowContext from '../utils/contexts/flowcontext';

export default React.createClass({
  changeFlowContext(stateType) {
    return () => {
      this.state.flowContext.changeFlow(stateType);
      this.changeExampleCode();
    };
  },
  changeFlowStrategy(flowStrategy) {
    return () => {
      this.state.flowContext.changeFlowStrategy(flowStrategy);
      this.changeExampleCode();
    };
  },
  changeExampleCode() {
    let example = this.state.flowContext.getStrategyCode();
    window.Rainbow.color(example, 'javascript', (code) => {
      this.setState({ code: code });
    });
  },
  componentDidMount() {
    this.changeExampleCode();
  },
  getInitialState() {
    return {
      demoState: 'promise',
      flowContext: new FlowContext(),
      code: null
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
            <div dangerouslySetInnerHTML={{__html: '<pre>'+this.state.code+'</pre>'}}>
            </div>
          </div>
        </div>
      </div>
    )
  }
});