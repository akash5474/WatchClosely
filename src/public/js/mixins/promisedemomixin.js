export default {
  demoFactory(type = 'sequence', flow) {
    let demoFunc;

    if ( type === 'sequence' ) {
      demoFunc = (cb) => {
        return flow.executeSequence(this.state.circles, (circle, idx) => {
          return circle.finishProcessing(idx).then(() => {
            return cb(idx);
          });
        });
      };
    } else if ( type === 'parallel' ) {
      demoFunc = (cb) => {
        return flow.executeParallel(this.state.circles, (circle, idx) => {
          return circle.finishProcessing(idx).then(() => {
            return cb(idx);
          });
        });
      };
    } else if ( type === 'limited' ) {
      demoFunc = (cb) => {
        return flow.executeLimitedParallel(this.state.circles, 2, (circle, idx) => {
          return circle.finishProcessing(idx).then(() => {
            return cb(idx);
          });
        });
      };
    }

    return () => {
      const delay = 800;
      this.setState({
        demoRunning: true
      });
      this.resetDemo().then(() => {
        setTimeout(() => {
          demoFunc((idx) => {
            console.log('UPDATE: Tasks Completed:', idx+1);
          }).catch((err) => {
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
      });
    };
  }
};