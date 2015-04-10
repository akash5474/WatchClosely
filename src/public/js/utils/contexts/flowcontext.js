import StrategyContext from './strategycontext';
import plainStrategies from '../strategies/plainstrategies';
import promiseStrategies from '../strategies/promisestrategies';
import generatorStrategies from '../strategies/generatorstrategies';
import asyncAwaitStrategies from '../strategies/asyncawaitstrategies';

export default class FlowContext {
  constructor(disableFunc) {
    this.currentState = null;
    this.currentStrategy = 'plain';
    this.running = false;
    this.complete = false;
    this.disableButtons = disableFunc;
    this.states = {
      plain: new StrategyContext( plainStrategies ),
      promise: new StrategyContext( promiseStrategies ),
      generator: new StrategyContext( generatorStrategies ),
      asyncAwait: new StrategyContext( asyncAwaitStrategies )
    };

    this.changeFlow('plain');
    this.changeFlowStrategy('sequence');
  }
  isRunning() {
    return this.running;
  }
  setRunning(val) {
    this.running = val;
  }
  isComplete() {
    return this.complete
  }
  setComplete(val) {
    this.complete = val;
  }
  changeFlow(flow) {
    // console.log(flow);
    if ( this.isRunning() ) return;
    this.currentState = this.states[flow] || this.states['plain'];
    this.changeFlowStrategy(this.currentStrategy);
  }
  changeFlowStrategy(strategy) {
    // console.log(strategy);
    if ( this.isRunning() ) return;
    this.currentStrategy = strategy;
    this.currentState.changeStrategy(strategy);
  }
  runStrategy(items, iteratorFunc, done) {
    if ( this.isRunning() ) return;

    this.setRunning(true);
    this.currentState.runStrategy(items, iteratorFunc, () => {
      this.setRunning(false);
      this.setComplete(true);
      done()
    });
  }
  getStrategyCode() {
    if (this.isRunning()) return;
    return this.currentState.stringFuncs(this.currentStrategy) || null;
  }
};