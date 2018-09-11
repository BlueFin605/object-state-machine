'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var sm = require('../statemachine.js');

function StateMachineCollection(name, states) {
  this.collection = new Map();
  this.name = name;
  this.states = states;
}

StateMachineCollection.prototype.addState = function (key, state) {
  if (this.collection.has(key)) {
    console.log(key + ' already exists in collection');
    return;
  }

  var statemachine = new sm.StateMachine(this.name, this.states);
  statemachine.setState(state);
  this.collection.set(key, statemachine);
};

StateMachineCollection.prototype.persistState = function (callback) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = this.collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var key = _ref2[0];
      var value = _ref2[1];

      value.persistState(function (state, data) {
        return callback(key, state, data);
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

StateMachineCollection.prototype.changeState = function (key, callback) {
  if (this.collection.has(key) === false) {
    console.log(key + ' does not exist in collection');
    return;
  }

  this.collection.get(key).changeState(callback);
};

module.exports.StateMachineCollection = StateMachineCollection;