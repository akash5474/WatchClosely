export default class StrategyContext {
  constructor(strategies) {
    this.currentState = null;
    this.states = strategies;

    this.changeStrategy();
  }
  changeStrategy(strategy) {
    // console.log('changing strategy', strategy);
    this.currentState = this.states[strategy]
      || this.states['sequence'];
  }
  runStrategy(items, iteratorFunc, done) {
    // console.log('running strategy', items, iteratorFunc.toString());
    this.currentState(items, iteratorFunc, done);
  }
};