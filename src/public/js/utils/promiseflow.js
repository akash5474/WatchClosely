function promiseFlowStringFunc() {
  function promiseFlow(chain, item, idx, iteratorFunc) {
    return chain.then(() => {
      return new Promise((resolve, reject) => {
        // Process the item
        item.process(( err ) => {
          if ( err ) return reject( err );
          // Signal resolution of promisified task
          resolve();
        });
      });
    })
    .then(() => {
      // Callback to indicate one processing
      // step is complete
      return iteratorFunc(idx);
    });
  };

  let retStr = promiseFlow.toString();
  // console.log(retStr);
  return retStr;
};

// Execute Sequential Processing
function executeSequence(arr, iteratorFunc) {
  let chain = Promise.resolve();
  arr.forEach((task, idx) => {
    // Queue up a chain of tasks
    chain = promiseFlow(chain, task, idx, iteratorFunc)
  });
  return chain.then();
};

// Execute Parallel Processing
function executeParallel(arr, iteratorFunc) {
  // Create an array of task promises for each task
  let tasks = arr.map((task, idx) => {
    return promiseFlow(Promise.resolve(), task, idx, iteratorFunc);
  });

  return Promise.all(tasks);
};

// Execute Limited Parallel Processing
function executeLimitedParallel(arr, concurrency, iteratorFunc) {
  let running = 0;
  let tasks = arr.map((task, idx) => {
    // Wrap in a function in order to
    // postpone processing for a later time
    return () => {
      return promiseFlow(Promise.resolve(), task, idx, iteratorFunc);
    };
  });

  // Recursive processing function
  function limitParallel() {
    return new Promise((resolve, reject) => {
      // Start up new task if possible
      while (running < concurrency && tasks.length) {
        let task = tasks.shift();

        // When the task is complete
        task().then(() => {
          running--;
          // Recursively call limitParallel to queue up more tasks
          // Resolve this task if another can't be queued up
          // because of the concurrency limit
          return limitParallel()
            .then(resolve);
        });
        running++;
      }

      // Complete if all there are no tasks left
      // and none of them are running
      if ( !tasks.length && !running ) {
        return resolve();
      }
    });
  };

  return limitParallel();
};

export default {
  executeSequence: executeSequence,
  executeParallel: executeParallel,
  executeLimitedParallel: executeLimitedParallel,
  flowStringFunc: promiseFlowStringFunc
};