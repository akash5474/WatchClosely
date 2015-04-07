import generatorFlow from './generatorutils';

function getRunTime() {
  let max = 5;
  let min = 1
  return Math.floor((( Math.random() * (max - min) + min ) * 1000 ) / 4 );
};

function animateOut(el, ms, cb) {
  el.animate({
    r: 40
  }, ms, 'linear', cb);
};

function animateIn(el, ms, cb) {
  el.animate({
    r: 30
  }, ms, 'linear', cb);
};

// function* attachProcess(chain, el, cb) {}
function initForControlFlow(el, idx) {
  return function(cb) {
    el.animate({
      cx: 50 + idx*100,
      cy: 200,
      fill: '#b02424',
      stroke: '#b02424'
    }, 500, 'linear', cb);
  };
};

function processItem(el) {
  return function*(task, callback) {
    let ms = getRunTime();
    yield task.initForControlFlow(callback);
    yield animateOut(el, ms, callback);
    yield animateIn(el, ms, callback);
    yield animateOut(el, ms, callback);
    yield animateIn(el, ms, callback);
    yield task.finishProcessing(callback);
  };
};

function finishProcessing(el, idx) {
  return function(cb) {
    el.animate({
      cx: 50 + idx*100,
      cy: 300,
      fill: '#7ab828',
      stroke: '#7ab828'
    }, 500, 'linear', cb);
  };
};

export default {
  initForControlFlow: initForControlFlow,
  processItem: processItem,
  finishProcessing: finishProcessing
};