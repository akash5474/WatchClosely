import StrategyContext from './strategycontext';
import plainStrategies from '../strategies/plainstrategies';
import promiseStrategies from '../strategies/promisestrategies';
import generatorStrategies from '../strategies/generatorstrategies';
import asyncAwaitStrategies from '../strategies/asyncawaitstrategies';

export default class FlowContext {
  constructor() {
    this.currentState = null;
    this.currentStrategy = 'promise';
    this.running = false;
    this.complete = false;
    this.states = {
      plain: new StrategyContext( plainStrategies ),
      promise: new StrategyContext( promiseStrategies ),
      generator: new StrategyContext( generatorStrategies ),
      asyncAwait: new StrategyContext( asyncAwaitStrategies )
    };

    this.changeFlow('promise');
    this.changeFlowStrategy('sequence');
  }
  changeFlow(flow) {
    // console.log(flow);
    if (this.running) return;
    this.currentState = this.states[flow] || this.states['promise'];
    this.changeFlowStrategy(this.currentStrategy);
  }
  changeFlowStrategy(strategy) {
    // console.log(strategy);
    if (this.running) return;
    this.currentStrategy = strategy;
    this.currentState.changeStrategy(strategy);
  }
  runStrategy(items, iteratorFunc, done) {
    if (this.running) return;
    this.running = true;
    this.currentState.runStrategy(items, iteratorFunc, () => {
      this.running = false;
      this.complete = true;
      done()
    });
  }
  getStrategyCode() {
    if (this.running) return;
    return this.currentState.stringFuncs(this.currentStrategy) || null;
  }
};