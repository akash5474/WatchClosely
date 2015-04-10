import stringFuncs from './stringfuncs/asyncawaitstringfuncs';

function promisifyIterator(item, idx, iteratorFunc) {
  // console.log('promisifyIterator');
  return new Promise((resolve, reject) => {
    iteratorFunc(item, idx, (err) => {
      console.log('iterating');
      if (err) reject(err);
      resolve();
    });
  });
};

export default {
  stringFuncs,
  sequence: async function sequence(items, iteratorFunc, done) {
    for ( let idx = 0; idx < items.length; idx++ ) {
      await promisifyIterator(items[idx], idx, iteratorFunc);
    };

    console.log('completed sequentialFlow asyncAwait');
    done();
  },

  parallel: async function parallel(items, iteratorFunc, done) {
    let promises = items.map((item, idx) => {
      return promisifyIterator(item, idx, iteratorFunc);
    });

    await* promises;
    console.log('completed parallelFlow asyncAwait');
    done()
  },

  limitedParallel(items, iteratorFunc, done) {
    let concurrency = 2;
    let running = 0;
    let promises = items.map((item, idx) => {
      return () => {
        return promisifyIterator(item, idx, iteratorFunc);
      };
    });

    async function limitParallel() {
      while ( running < concurrency && promises.length ) {
        let prom = promises.shift();
        running++;

        limitParallel();
        await prom();
        running--;

        if ( !running && !promises.length ) {
          console.log('completed limitedParallelFlow asyncAwait');
          done();
        }
      }
    };

    return limitParallel();
  }
}