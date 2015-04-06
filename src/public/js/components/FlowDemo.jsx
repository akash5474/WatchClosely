import React from 'react';
import Raphael from 'raphael';
import Rainbow from '../rainbow-custom.min';
import DemoMixinFactory from '../mixins/demomixinfactory';

export default function FlowDemoFactory(type, tasks, flow) {
  return React.createClass({
    mixins: [ DemoMixinFactory(type, flow) ],
    initDemo(tasks) {
      let node = React.findDOMNode(this.refs.demoCanvas);
      let width = node.offsetWidth;
      let height = 400;
      let paper = Raphael(node, width, height);
      let circles = [];

      for ( let i = 0; i < 5; i++ ) {
        let circle = paper.circle(50 + i*100, 100, 30);
        circle.attr('fill', '#346699');
        circle.attr('stroke', '#346699');
        circle.initForControlFlow = tasks.initForControlFlow(circle, i);
        circle.process = tasks.processItem(circle);
        circle.finishProcessing = tasks.finishProcessing(circle, i);

        circles.push(circle);
      };

      this.setState({
        circles: circles
      });
    },
    resetDemo() {
      return new Promise((resolve, reject) => {
        if ( this.state.demoRunning || !this.state.demoFinished ) {
          return resolve();
        }

        this.state.circles.forEach((circle, i) => {
          circle.animate({
            cx: 50 + i*100,
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
        code: ''
      };
    },
    componentDidMount() {
      this.initDemo(tasks);
      // window.Rainbow.color(flow.appendStepStringFunc(), 'javascript',
      //   (results) => {
      //     console.log(results);
      //     this.setState({
      //       code: results
      //     });
      //   });
    },
    render() {
      return (
        <div className="row">
          <div ref="demoCanvas" className="small-6 columns">
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
          <div className="small-6 columns">
            <pre>
              <div className="code-container"
                dangerouslySetInnerHTML={{__html: this.state.code}}
              ></div>
            </pre>
          </div>
        </div>
      )
    }
  });
};