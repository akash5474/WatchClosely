import stringFuncs from './stringfuncs/plainstringfuncs';

export default {
  stringFuncs,
  sequence(items, iteratorFunc, done) {
    let idx = 0;
    function iterate(idx, cb) {
      return iteratorFunc(items[idx], idx, (err) => {
        if (err) {
          console.log('ERROR:', err);
          console.log(err.stack);
          throw err;
        }

        if ( idx === items.length - 1 ) {
          return cb();
        }

        iterate(++idx, cb);
      });
    }

    iterate(0, () => {
      console.log('completed sequentialFlow plain');
      done();
    });
  },

  parallel(items, iteratorFunc, done) {
    let completed = 0;

    items.forEach((item, idx) => {
      iteratorFunc(item, idx, (err) => {
        if (err) {
          console.log('ERROR:', err);
          console.log(err.stack);
          throw err;
        }

        if ( ++completed === items.length - 1 ) {
          console.log('completed parallelFlow plain');
          done();
        }
      });
    });
  },

  limitedParallel(items, iteratorFunc, done) {
    let concurrency = 2;
    let running = 0;
    let tasks = items.map((el) => { return el });

    function iterate(idx) {
      while(running < concurrency && tasks.length) {
        let item = tasks.shift();
        running++;
        iteratorFunc(item, idx, (err) => {
          if (err) {
            console.log('ERROR:', err);
            console.log(err.stack);
            throw err;
          }
          running--;
          iterate(++idx);
        });

        iterate(++idx);
      }

      if ( !running && !tasks.length ) {
        console.log('completed limitedParallelFlow plain');
        done();
      }
    }

    iterate(0);
  }
}