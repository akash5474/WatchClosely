import generatorFlow from './generatorutils';

function generatorFlowStringFunc() {
  function generatorFlow(generatorFunc) {
    function callback(err) {
      if (err) {
        return generatorFunc.throw(err);
      }

      let results = [].slice.call(arguments, 1);
      generator.next( results.length > 1 ? results : results[0] );
    };

    let generator = generatorFunc(callback);
    generator.next();
  };

  let retStr = generatorFlow.toString();
  return retStr;
};

function executeSequence(arr, iteratorFunc, finished) {
  generatorFlow(function* (callback) {
    for ( let idx = 0; idx < arr.length; idx++ ) {
      let task = arr[idx];
      yield* task.process(task, callback);
      iteratorFunc(task, idx);
    }
    finished();
  });
};

function executeParallel(arr, iteratorFunc, finished) {
  return generatorFlow(function* (done) {
    let completed = 0;
    let tasks = arr.map((task, idx) => {
      return generatorFlow(function* (callback) {
        yield* task.process(task, callback);
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
      generatorFlow(function* (callback) {
        yield* task.process(task, callback);
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
  executeLimitedParallel: executeLimitedParallel,
  flowStringFunc: generatorFlowStringFunc
};