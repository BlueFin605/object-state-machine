var sinon = require('sinon')
var assert = require('assert')
var sm = require('./statemachine.js')

test('constructor saves init values', () => {
  var statesFactory = {
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

  var statemachine = new sm.Builder('smname', statesFactory, (creator) => creator.createNextState('onhook', null)).build()
  expect(statemachine.getName()).toBe('smname')
  expect(statemachine.getStatesFactory()).toBe(statesFactory)
  expect(statemachine.getPersistStateCallback()).toBe(null)
})

test('persistState saves callback', () => {
  var callback = (state, data) => { console.log(`phone sm persist state ${state}:${data}`) }
  var statemachine = new sm.Builder('smname', null, (creator) => creator.createNextState('onhook', null))
    .withPersistance(callback)
    .build()
  expect(statemachine.getPersistStateCallback()).toBe(callback)
})

test('state initialisor gets called', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var calledcreateor = 'test will fail if it is a string'
  var statemachine = new sm.Builder('smname', null, (creator) => {
    calledcreateor = creator
    return origstatedata
  }).build()

  statemachine.changeState((state, data) => null)
  console.log(`calledcreateor ${calledcreateor}`)

  expect('createNextState' in calledcreateor).toBe(true)
  expect(statemachine.queryState((state, data) => data)).toBe('data')
  expect(statemachine.queryState((state, data) => state)).toBe(origstate)
})

test('change state to null makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (creator) => origstatedata).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeState((state, data) => newstatedata)
  statemachine.changeState((state, data) => null)
  expect(statemachine.queryState((state, data) => data)).toEqual(newdata)
  expect(statemachine.queryState((state, data) => state)).toBe(newstate)
})

test('change state to same state makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (creator) => origstatedata).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeState((state, data) => newstatedata)
  statemachine.changeState((state, data) => newstatedata)
  expect(statemachine.queryState((state, data) => data)).toEqual(newdata)
  expect(statemachine.queryState((state, data) => state)).toBe(newstate)
})

test('change state to new state changes state', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (creator) => origstatedata).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeState((state, data) => newstatedata)
  var newerstate = { state: 'state3' }
  var newerdata = { data: 'data4' }
  var newerstatedata = { state: newerstate, data: newerdata }
  statemachine.changeState((state, data) => newerstatedata)
  expect(statemachine.queryState((state, data) => data)).toEqual(newerdata)
  expect(statemachine.queryState((state, data) => state)).toBe(newerstate)
})

test('initial setting of state does not persist callback', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var callback = sinon.fake()
  var statemachine = new sm.Builder('smname', null, (creator) => origstatedata).withPersistance(callback).build()
  statemachine.changeState((state, data) => null)
  assert(!callback.called)
})

test('change state to new state changes state calls persist callback', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var callback = sinon.fake()
  var statemachine = new sm.Builder('smname', null, (creator) => origstatedata).withPersistance(callback).build()
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
