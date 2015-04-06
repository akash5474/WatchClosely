function getRunTime() {
  let max = 5;
  let min = 1
  return Math.floor((( Math.random() * (max - min) + min ) * 1000 ) / 4 );
}

function animateOut(el, ms) {
  return new Promise((resolve, reject) => {
    el.animate({
      r: 40
    }, ms, 'linear', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

function animateIn(el, ms) {
  return new Promise((resolve, reject) => {
    el.animate({
      r: 30
    }, ms, 'linear', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Add the processing task animation to the promise chain
// And execute the callback on completion
function attachProcess(chain, el, iteratorFunc) {
  const animTime = getRunTime();
  return chain.then(() => {
    return animateOut(el, animTime).then(() => {
      return animateIn(el, animTime);
    }).then(() => {
      return animateOut(el, animTime);
    }).then(() => {
      return animateIn(el, animTime);
    });
  }).then(iteratorFunc);
};

export default {
  initForControlFlow(el, idx) {
    return function() {
      return new Promise((resolve, reject) => {
        el.animate({
          cx: 50 + idx*100,
          cy: 200,
          fill: '#b02424',
          stroke: '#b02424'
        }, 500, 'linear', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    };
  },

  processItem(el) {
    return function(iteratorFunc) {
      let chain = Promise.resolve();
      chain = attachProcess(chain, el, iteratorFunc);
    };
  },

  finishProcessing(el, idx) {
    return function() {
      return new Promise((resolve, reject) => {
        el.animate({
          cx: 50 + idx*100,
          cy: 300,
          fill: '#7ab828',
          stroke: '#7ab828'
        }, 500, 'linear', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    };
  }
};