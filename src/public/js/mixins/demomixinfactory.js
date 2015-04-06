export default function DemoMixinFactory(type = 'promise', flow) {
  const factories = {
    promiseDemoProxy(type = 'sequence') {
      let demoFunc;

      if ( type === 'sequence' ) {
        demoFunc = (cb) => {
          return flow.executeSequence(this.state.circles, (circle, idx) => {
            return circle.finishProcessing().then(() => {
              return cb(idx);
            });
          });
        };
      } else if ( type === 'parallel' ) {
        demoFunc = (cb) => {
          return flow.executeParallel(this.state.circles, (circle, idx) => {
            return circle.finishProcessing().then(() => {
              return cb(idx);
            });
          });
        };
      } else if ( type === 'limited' ) {
        demoFunc = (cb) => {
          return flow.executeLimitedParallel(this.state.circles, 2, (circle, idx) => {
            return circle.finishProcessing().then(() => {
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
    },
    generatorDemoProxy(type = 'sequence') {
      let demoFunc;

      function asyncGeneratorFlow(generatorFunction) {
        function callback(err) {
          if (err) {
            return generatorFunction.throw(err);
          }
          const results = [].slice.call(arguments, 1);
          generator.next( results.length > 1 ? results: results[0] );
        }

        const generator = generatorFunction(callback);
        generator.next();
      };

      if ( type === 'sequence' ) {
        demoFunc = (cb, done) => {
          let state = this.state;
          asyncGeneratorFlow(function* (callback) {
            yield flow.executeSequence(state.circles, (circle, idx) => {
              return cb(idx);
            }, callback);
            done();
          });
        };
      } else if ( type === 'parallel' ) {
        demoFunc = (cb, done) => {
          let state = this.state;
          asyncGeneratorFlow(function* (callback) {
            yield flow.executeParallel(state.circles, (circle, idx) => {
              return cb(idx);
            }, callback);
            done();
          });
        };
      } else if ( type === 'limited' ) {
        demoFunc = (cb, done) => {
          let state = this.state;
          asyncGeneratorFlow(function* (callback) {
            yield flow.executeLimitedParallel(state.circles, 2, (circle, idx) => {
              return cb(idx);
            }, callback);
            done();
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
            }, () => {
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

  return {
    demoFactory: factories[type+'DemoProxy']
  };
};