import stringFuncs from './stringfuncs/generatorstringfuncs';

function runGeneratorFlow(generatorFunc) {
  function callback(err) {
    if (err) {
      generatorFunc.throw(err);
    }

    let results = [].slice.call(arguments, 1);
    generator.next(results.length > 1 ? results : results[0]);
  }

  let generator = generatorFunc(callback);
  generator.next();
}

export default {
  stringFuncs,
  sequence(items, iteratorFunc, done) {
    runGeneratorFlow(function* (callback) {
      for ( let i = 0; i < items.length; i++ ) {
        yield iteratorFunc(items[i], i, callback);
      }
      console.log('completed sequentialFlow generator');
      done();
    });
  },

  parallel(items, iteratorFunc, done) {
    runGeneratorFlow(function* (callback) {
      let tasks = items.map((item, idx) => {
        return iteratorFunc(item, idx, callback);
      });

      yield* tasks;
      console.log('completed parallelFlow generator');
      done();
    });
  },

  limitedParallel(items, iteratorFunc, done) {
    let concurrency = 2;
    let running = 0;
    let tasks = items.map((item, idx) => {
      return function(cb) {
        iteratorFunc(item, idx, cb)
      };
    });

    function limitParallel() {
      runGeneratorFlow(function* (callback) {
        while ( running < concurrency && tasks.length ) {
          let task = tasks.shift();
          running++;
          limitParallel();

          yield task(callback);
          running--;

          if ( !running && !tasks.length ) {
            console.log('completed limitedParallelFlow generator');
            done();
          }
        }
      });
    };

    limitParallel();
  }
}