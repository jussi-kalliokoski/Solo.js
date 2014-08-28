
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Solo = factory();
  }
}(this, function(require, exports, module) {

function Solo () {
    "use strict";

    var tasks = [];

    function noop () {}

    function runNextTask () {
        if ( tasks.length === 0 ) { return; }

        tasks[0]()[
            "catch"](noop)
            .then(function shiftQueue () {
                tasks.shift();
                runNextTask();
            });
    }

    function run (task) {
        return new Promise(function runTask (resolve, reject) {
            resolve(task());
        });
    }

    function queue (task) {
        return new Promise(function createTask (resolve, reject) {
            var isRunning = tasks.length > 0;

            tasks.push(function runCurrentTask () {
                var result = run(task);
                resolve(result);
                return result;
            });

            if ( !isRunning ) {
                Promise.resolve().then(runNextTask);
            }
        });
    }

    return queue;
}

return Solo;

}));
