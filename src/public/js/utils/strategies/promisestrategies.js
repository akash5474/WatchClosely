import stringFuncs from './stringfuncs/promisestringfuncs';

function promisifyIterator(item, idx, iteratorFunc) {
  // console.log('promisifyIterator');
  return new Promise((resolve, reject) => {
    iteratorFunc(item, idx, (err) => {
      // console.log('iterating');
      if (err) reject(err);
      resolve();
    });
  });
}

export default {
  stringFuncs,
  sequence(items, iteratorFunc, done) {
    let sequence = Promise.resolve();
    items.forEach((item, idx) => {
      sequence = sequence.then(() => {
        return promisifyIterator(item, idx, iteratorFunc);
      });
    });

    return sequence.then(() => {
      console.log('completed sequentialFlow promise');
      done();
    });
  },

  parallel(items, iteratorFunc, done) {
    let promises = items.map((item, idx) => {
      return promisifyIterator(item, idx, iteratorFunc);
    });

    return Promise.all(promises).then(() => {
      console.log('completed parallelFlow promise');
      done()
    });
  },

  limitedParallel(items, iteratorFunc, done) {
    let concurrency = 2;
    let running = 0;
    let promises = items.map((item, idx) => {
      return () => {
        return promisifyIterator(item, idx, iteratorFunc);
      };
    });

    function limitParallel() {
      return new Promise((resolve, reject) => {
        while ( running < concurrency && promises.length ) {
          let prom = promises.shift();

          prom().then(() => {
            running--;
            limitParallel().then(resolve);
          });

          running++;
        }

        if ( !running && !promises.length ) {
          console.log('completed limitedParallelFlow promise');
          return resolve();
        }
      });
    };

    return limitParallel().then(done);
  }
}