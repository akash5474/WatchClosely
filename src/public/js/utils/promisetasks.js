function animateOut(el) {
  return new Promise((resolve, reject) => {
    el.animate({
      r: 40
    }, 400, 'linear', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

function animateIn(el) {
  return new Promise((resolve, reject) => {
    el.animate({
      r: 30
    }, 400, 'linear', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

function attachProcess(chain, el, cb) {
  return chain.then(() => {
    return animateOut(el).then(() => {
      return animateIn(el);
    }).then(() => {
      return animateOut(el);
    }).then(() => {
      return animateIn(el);
    });
  }).then(cb);
};

export function initForControlFlow(circle) {
  return function(idx) {
    return new Promise((resolve, reject) => {
      circle.animate({
        cx: 150 + idx*100,
        cy: 200,
        fill: '#b02424',
        stroke: '#b02424'
      }, 500, 'linear', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };
};

export function processItem(el) {
  return function(cb) {
    var chain = Promise.resolve();
    chain = attachProcess(chain, el, cb);
  };
};

export function finishProcessing(el) {
  return function(idx) {
    return new Promise((resolve, reject) => {
      el.animate({
        cx: 150 + idx*100,
        cy: 300,
        fill: '#7ab828',
        stroke: '#7ab828'
      }, 500, 'linear', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };
};