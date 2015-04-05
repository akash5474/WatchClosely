import React from 'react';
import FlowDemoMixin from '../utils/flowdemomixin';
import promiseFlow from '../utils/promiseflow';
import promiseTasks from '../utils/promisetasks'

export default React.createClass({
  mixins: [FlowDemoMixin],
  componentDidMount() {
    this.initDemo(promiseTasks);
  },
  render() {
    return (
      <div className="small-12 columns">
        <ul className="button-group radius">
          <li>
            <button className="button" disabled={this.state.demoRunning}
              onClick={this.demoFactory('sequence', promiseFlow)}
            >Sequence</button>
          </li>
          <li>
            <button className="button" disabled={this.state.demoRunning}
              onClick={this.demoFactory('parallel', promiseFlow)}
            >Parallel</button>
          </li>
          <li>
            <button className="button" disabled={this.state.demoRunning}
              onClick={this.demoFactory('limited', promiseFlow)}
            >Limited Parallel</button>
          </li>
        </ul>
      </div>
    )
  }
});