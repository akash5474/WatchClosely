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

function executeSequence(arr, iteratorFunc, finished) {
  asyncGeneratorFlow(function* (callback) {
    for ( let idx = 0; idx < arr.length; idx++ ) {
      let task = arr[idx];
      yield task.process(task, callback);
      iteratorFunc(task, idx);
    }
    finished();
  });
};

function executeParallel(arr, iteratorFunc, finished) {
  return asyncGeneratorFlow(function* (done) {
    let completed = 0;
    let tasks = arr.map((task, idx) => {
      return asyncGeneratorFlow(function* (callback) {
        yield task.process(task, callback);
        iteratorFunc(task, idx);
        if ( ++completed === arr.length ) {
          done();
        }
      });
    });

    yield tasks;
    finished();
  });
};
function executeLimitedParallel(arr, concurrency, iteratorFunc, finished) {
  let running = 0;
  let tasks = arr.map((task, idx) => {
    return (completed) => {
      asyncGeneratorFlow(function* (callback) {
        yield task.process(task, callback);
        iteratorFunc(task, idx);
        completed();
      });
    };
  });

  function limitParallel() {
    while (running < concurrency && tasks.length) {
      let task = tasks.shift();
      task(() => {
        running--;
        limitParallel();

        if ( !tasks.length && !running ) {
          finished();
        }
      });
      running++;
    }
  };

  return limitParallel();
};

export default {
  executeSequence: executeSequence,
  executeParallel: executeParallel,
  executeLimitedParallel: executeLimitedParallel
};