import React from 'react';
import Raphael from 'raphael';
import * as promiseFlow from '../utils/promiseflow';
import * as tasks from '../utils/promisetasks'

var svg;

export default React.createClass({
  initDemo() {
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
      this.state.circles.forEach((circle, i) => {
        circle.attr({
          cx: 150 + i*100,
          cy: 100,
          fill: '#346699',
          stroke: '#346699',
        });
      });
      resolve();
    });
  },
  demoFactory(type = 'sequence') {
    let demoFunc;

    if ( type === 'sequence' ) {
      demoFunc = () => {
        return promiseFlow.executeSequence(this.state.circles, (circle, idx) => {
          return circle.finishProcessing(idx);
        });
      };
    } else if ( type === 'parallel' ) {
      demoFunc = () => {
        return promiseFlow.executeParallel(this.state.circles, (circle, idx) => {
          return circle.finishProcessing(idx);
        });
      };
    } else if ( type === 'limited' ) {
      demoFunc = () => {
        return promiseFlow.executeLimitedParallel(this.state.circles, 2, (circle, idx) => {
          return circle.finishProcessing(idx);
        });
      };
    }

    return () => {
      this.resetDemo().then(() => {
        setTimeout(() => {
          demoFunc().catch(function(err) {
            console.log('err', err);
            console.log(err.stack);
          }).then((progress) => {
            console.log('complete');
          });
        }, 1200);
      })

    };
  },
  getInitialState() {
    return {
      width: 0,
      circles: [],
    }
  },
  componentDidMount() {
    this.initDemo();
    // this.startDemo();
  },
  render() {
    let style = {
      width: `${this.state.width}%`
    }
    return (
      <div className="small-12 columns">
        <ul className="button-group radius">
          <li><button className="button" onClick={this.demoFactory('sequence')} >Sequence</button></li>
          <li><button className="button" onClick={this.demoFactory('parallel')}>Parallel</button></li>
          <li><button className="button" onClick={this.demoFactory('limited')}>Limited Parallel</button></li>
        </ul>
      </div>
    )
  }
});