import React from 'react';
import Raphael from 'raphael';

export default React.createClass({
  initCanvas() {
    let node = React.findDOMNode(this.refs.demoCanvas);
    let width = node.offsetWidth;
    let height = 500;
    let paper = Raphael(node, width, height);
    let circles = [];

    for ( let i = 0; i < 5; i++ ) {
      let circle = paper.circle(50,  50 + i*90, 30);
      circle.attr('fill', '#346699');
      circle.attr('stroke', '#346699');

      circles.push(circle);
    };

    this.setState({
      circles: circles
    });
  },
  animateCircle(circle, idx, done) {
    // console.log('animateing circle');
    circle.animate({
      cx: 380,
      cy: 50 + idx*100,
      fill: '#7ab828',
      stroke: '#7ab828'
    }, 1000, 'linear', (err) => {
      if (err) return done(err);
      done();
    });
  },
  resetDemo() {
    if ( !this.props.flowContext.complete ) return Promise.resolve();

    let promises = this.state.circles.map((circle, idx) => {
      return new Promise((resolve, reject) => {
        circle.animate({
          cx: 50,
          cy: 50 + idx*90,
          fill: '#346699',
          stroke: '#346699'
        }, 1000, 'linear', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });

    return Promise.all(promises)
    .then(() => {
      this.props.flowContext.complete = false;
    });
  },
  runDemo() {
    this.props.flowContext.runStrategy(this.state.circles,
      this.animateCircle, () => {
        console.log('demo finished');
      });
  },
  startDemo() {
    if ( this.props.flowContext.running ) return;

    console.log('starting demo');

    this.resetDemo().then(() => {
      this.runDemo()
    });
  },
  componentDidMount() {
    this.initCanvas();
  },
  getInitialState() {
    return {
      circles: []
    }
  },
  render() {
    return (
      <div className="row">
        <div className="small-12 columns">
          <button className="button radius"
            onClick={this.startDemo}
          >Start</button>
        </div>
        <div ref="demoCanvas" className="small-12 columns">
        </div>
      </div>
    )
  }
});