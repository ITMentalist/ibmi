import IBMi from './ibmi';
import DataQueue from './data-queue/data-queue';

function Module(opts) {
  return new IBMi(opts);
}

Module.DataQueue = DataQueue;

module.exports = Module;
