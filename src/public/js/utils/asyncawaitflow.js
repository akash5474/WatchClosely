import promiseTasks from './promisetasks';

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

async function executeSequence(arr, iteratorFunc, finished) {
  let prom = Promise.resolve();
  for ( let idx = 0; idx < arr.length; idx++ ) {
    let task = arr[idx];
    // await promiseTasks.initForControlFlow(task, idx)();
    await promiseTasks.promiseFlow(prom, task, idx, () => {});
    await promiseTasks.finishProcessing(task, idx)();
    iteratorFunc(task, idx);
  }
  finished();
};

async function executeParallel(arr, iteratorFunc, finished) {
  let completed = 0;
  let tasks = arr.map(async function(task, idx) {
    let prom = Promise.resolve();
    await promiseTasks.promiseFlow(prom, task, idx, () => {});
    await promiseTasks.finishProcessing(task, idx)();
    iteratorFunc(task, idx);
  });

  await* tasks;
  finished();
};

function executeLimitedParallel(arr, concurrency, iteratorFunc, finished) {
  let running = 0;
  let tasks = arr.map(function(task, idx) {
    return async function(completed) {
      let prom = Promise.resolve();
      await promiseTasks.promiseFlow(prom, task, idx, () => {});
      await promiseTasks.finishProcessing(task, idx)();
      iteratorFunc(task, idx);
      completed();
    };
  });

  async function limitParallel() {
    while (running < concurrency && tasks.length) {
      let task = tasks.shift();
      running++;

      limitParallel();
      await task(() => {
        running--;

        if ( !tasks.length && !running ) {
          finished();
        }
      });
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