import React from 'react';
import Raphael from 'raphael';
import DemoMixinFactory from '../mixins/demomixinfactory';

export default function FlowDemoFactory(tasks, flow) {
  return React.createClass({
    mixins: [ DemoMixinFactory(flow) ],
    initDemo(tasks) {
      let node = this.getDOMNode();
      let width = node.offsetWidth;
      let height = 400;
      let paper = Raphael(node, width, height);
      let circles = [];

      for ( let i = 0; i < 5; i++ ) {
        let circle = paper.circle(150 + i*100, 100, 30);
        circle.attr('fill', '#346699');
        circle.attr('stroke', '#346699');
        circle.initForControlFlow = tasks.initForControlFlow(circle);
        circle.process = tasks.processItem(circle);
        circle.finishProcessing = tasks.finishProcessing(circle);

        circles.push(circle);
      };

      this.setState({
        circles: circles
      });
    },
    resetDemo() {
      return new Promise((resolve, reject) => {
        if ( this.state.demoRunning || !this.state.demoFinished ) {
          resolve();
        }

        this.state.circles.forEach((circle, i) => {
          circle.animate({
            cx: 150 + i*100,
            cy: 100,
            fill: '#346699',
            stroke: '#346699',
          }, 500, 'linear', (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    },
    getInitialState() {
      return {
        width: 0,
        circles: [],
        demoFinished: false,
        demoRunning: false,
      };
    },
    componentDidMount() {
      this.initDemo(tasks);
    },
    render() {
      return (
        <div className="small-12 columns">
          <ul className="button-group radius">
            <li>
              <button className="button" disabled={this.state.demoRunning}
                onClick={this.demoFactory('sequence')}
              >Sequence</button>
            </li>
            <li>
              <button className="button" disabled={this.state.demoRunning}
                onClick={this.demoFactory('parallel')}
              >Parallel</button>
            </li>
            <li>
              <button className="button" disabled={this.state.demoRunning}
                onClick={this.demoFactory('limited')}
              >Limited Parallel</button>
            </li>
          </ul>
        </div>
      )
    }
  });
};