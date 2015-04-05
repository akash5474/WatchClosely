// import d3 from 'd3';

function appendStep(chain, el, i, cb) {
  return chain.then( (function() {
    var idx = i;
    return function() {
      el.initForControlFlow(idx);
    };
  })() )
  .then( executeStep( el, i ))
  .then( (function() {
    var idx = i;
    return function() {
      return cb(el, idx);
    };
  })() );
};

export function getRandomNum() {
  let max = 5;
  let min = 1
  return Math.floor((Math.random() * (max - min) + min)*1000);
}

export function timeoutPromise(item, idx) {
  return new Promise((resolve, reject) => {
    item.process((err) => {
      if ( err ) return reject(err);
      // console.log('promise resolved', idx)
      resolve();
    });
    // setTimeout(resolve, duration);
  });
}

export function executeStep(item, idx) {
  return () => {
    return timeoutPromise(item, idx);
  };
}

export function executeSequence(arr, cb) {
  var chain = Promise.resolve();
  // for (var i = 0; i < arr.length; i++) {
  arr.forEach((el, i) => {
    chain = appendStep(chain, el, i, cb)
  })
  // }
  return chain.then();
};

export function executeParallel(arr, cb) {
  var tasks = arr.map(function(el, i) {
    return appendStep(Promise.resolve(), el, i, cb);
  });

  return Promise.all(tasks);
};

export function executeLimitedParallel(arr, concurrency, cb) {
  var tasks = arr.map(function(el, i) {
    return function() {
      return appendStep(Promise.resolve(), el, i, cb)
    };
  });
  var running = 0;

  function limitParallel(concurrency, cb) {
    return new Promise((resolve, reject) => {

      while (running < concurrency && tasks.length) {
        var task = tasks.shift();
        task().then(() => {
          running--;
          return limitParallel(concurrency, cb).then(resolve);
        });
        running++;
      }

      if ( !tasks.length && !running ) {
        return resolve();
      }
    });
  };

  return limitParallel(concurrency, cb)
};