import StrategyContext from './strategycontext';
import promiseStrategies from '../strategies/promisestrategies';
import generatorStrategies from '../strategies/generatorstrategies';
import asyncAwaitStrategies from '../strategies/asyncawaitstrategies';

export default class FlowContext {
  constructor() {
    this.currentState = null;
    this.currentStrategy = 'promise';
    this.states = {
      promise: new StrategyContext( promiseStrategies ),
      generator: new StrategyContext( generatorStrategies ),
      asyncAwait: new StrategyContext( asyncAwaitStrategies )
    };

    this.changeFlow('promise');
    this.changeFlowStrategy('sequence');
  }
  changeFlow(flow) {
    // console.log(flow);
    this.currentState = this.states[flow] || this.states['promise'];
    this.changeFlowStrategy(this.currentStrategy);
  }
  changeFlowStrategy(strategy) {
    // console.log(strategy);
    this.currentStrategy = strategy;
    this.currentState.changeStrategy(strategy);
  }
  runStrategy(items, iteratorFunc, done) {
    this.currentState.runStrategy(items, iteratorFunc, done);
  }
  getStrategyCode() {
    return this.currentState.stringFuncs(this.currentStrategy) || null;
  }
};