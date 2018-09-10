var sinon = require('sinon')
var assert = require('assert')
var sm = require('./statemachine.js')

test('constructor saves init values', () => {
  var states = {
    state1: {
      create: function () {
        return 1
      }
    },
    state2: {
      create: function () {
        return new 2()
      }
    }
  }
  var statemachine = new sm.StateMachine('smname', states)
  expect(statemachine.name).toBe('smname')
  expect(statemachine.states).toBe(states)
  expect(statemachine.persistStateCallback).toBe(null)
})

test('persistState saves callback', () => {
  var statemachine = new sm.StateMachine('smname', null)
  var callback = (state, data) => { console.log(`phone sm persist state ${state}:${data}`) }
  statemachine.persistState(callback)
  expect(statemachine.persistStateCallback).toBe(callback)
})

test('setstate sets state and data', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.StateMachine('smname', null)
  statemachine.setState(origstatedata)
  expect(statemachine.currentData).toBe('data')
  expect(statemachine.currentState).toBe(origstate)
})

test('change state to null makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.StateMachine('smname', null)
  statemachine.setState(origstatedata)
  statemachine.changeState((state, data) => null)
  expect(statemachine.currentData).toBe('data')
  expect(statemachine.currentState).toBe(origstate)
})

test('change state to same state makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.StateMachine('smname', null)
  statemachine.setState(origstatedata)

  var newstatedata = { state: origstate, data: 'data2' }
  statemachine.changeState((state, data) => newstatedata)
  expect(statemachine.currentData).toBe('data')
  expect(statemachine.currentState).toBe(origstate)
})

test('change state to new state changes state', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.StateMachine('smname', null)
  statemachine.setState(origstatedata)

  var newstate = { state: 'state2' }
  var newstatedata = { state: newstate, data: 'data2' }
  statemachine.changeState((state, data) => newstatedata)
  expect(statemachine.currentData).toBe('data2')
  expect(statemachine.currentState).toBe(newstate)
})

test('change state to new state changes state calls persist callback', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.StateMachine('smname', null)
  statemachine.setState(origstatedata)
  var callback = sinon.fake()
  statemachine.persistState(callback)

  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeState((state, data) => newstatedata)
  assert(callback.called)
  // compare values, i.e. copied successfully
  assert(callback.calledWith(newstate, newdata))
  // compare by reference, it should not match
  assert(!callback.calledWith(newstate, sinon.match.same(newdata)))
})
