// Appends task to a chain of promises;
function appendStep(chain, task, idx, iteratorFunc) {
  return chain.then(() => {
    // Pre-process task aka animate circle to processing area
    return task.initForControlFlow();
  })
  // Start task's processing animation
  .then( executeStep(task, idx))
  // Callback to indicate processing is complete
  .then(() => {
    return iteratorFunc(task, idx);
  });
};

function appendStepStringFunc() {
  function addStepToChain(chain, task, idx, iteratorFunc) {
    return chain.then(() => {
      return new Promise((resolve, reject) => {
        // Process the task
        task.process(( err ) => {
          if ( err ) return reject( err );
          // Signal completion of processing task
          resolve();
        });
      });
    })
    // Callback to indicate processing is complete
    .then(() => {
      return iteratorFunc(task, idx);
    });
  };

  let retStr = addStepToChain.toString();
  console.log(retStr);
  return retStr;
};

// Return promisified task which resolves when completed;
function executeStep(task, idx) {
  return () => {
    return new Promise((resolve, reject) => {
      // Process the task
      task.process(( err ) => {
        if ( err ) return reject( err );
        // Signal completion of processing task
        resolve();
      });
    });
  };
};

// Execute Sequential Processing
function executeSequence(arr, iteratorFunc) {
  let chain = Promise.resolve();
  arr.forEach((task, idx) => {
    // Queue up a chain of tasks
    chain = appendStep(chain, task, idx, iteratorFunc)
  });
  return chain.then();
};

// Execute Parallel Processing
function executeParallel(arr, iteratorFunc) {
  // Create an array of task promises for each task
  let tasks = arr.map((task, idx) => {
    return appendStep(Promise.resolve(), task, idx, iteratorFunc);
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
      return appendStep(Promise.resolve(), task, idx, iteratorFunc);
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
  appendStepStringFunc: appendStepStringFunc
};