import Raphael from 'raphael';

export default {
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
  demoFactory(type = 'sequence', flow) {
    let demoFunc;

    if ( type === 'sequence' ) {
      demoFunc = () => {
        return flow.executeSequence(this.state.circles, (circle, idx) => {
          return circle.finishProcessing(idx);
        });
      };
    } else if ( type === 'parallel' ) {
      demoFunc = () => {
        return flow.executeParallel(this.state.circles, (circle, idx) => {
          return circle.finishProcessing(idx);
        });
      };
    } else if ( type === 'limited' ) {
      demoFunc = () => {
        return flow.executeLimitedParallel(this.state.circles, 2, (circle, idx) => {
          return circle.finishProcessing(idx);
        });
      };
    }

    return () => {
      let delay = 800;
      this.setState({
        demoRunning: true
      });
      this.resetDemo().then(() => {
        setTimeout(() => {
          demoFunc().catch((err) => {
            console.log('err', err);
            console.log(err.stack);
          }).then((progress) => {
            this.setState({
              demoFinished: true,
              demoRunning: false
            });
            console.log('complete');
          });
        }, delay);
      })

    };
  },
  getInitialState() {
    return {
      width: 0,
      circles: [],
      demoFinished: false,
      demoRunning: false,
    };
  }
};