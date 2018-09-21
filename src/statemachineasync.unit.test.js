var sinon = require('sinon')
var assert = require('assert')
var sm = require('./statemachineasync.js')

test('async constructor saves init values', () => {
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

test('async persistState saves callback', () => {
  var callback = (state, data) => { console.log(`phone sm persist state ${state}:${data}`) }
  var statemachine = new sm.Builder('smname', null, (creator, onCreated) => onCreated(null, creator.createNextState('onhook', null)))
    .withPersistance(callback)
    .build()
  expect(statemachine.getPersistStateCallback()).toBe(callback)
})

test('async state initialisor gets called', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var calledcreateor = 'test will fail if it is a string'
  var statemachine = new sm.Builder('smname', null, (creator, onCreated) => {
    calledcreateor = creator
    onCreated(null, origstatedata)
  }).build()

  statemachine.changeState((_state, _data, _callback) => null, (err, result) => {
    console.log(`${err}, ${result}`)
    expect('createNextState' in calledcreateor).toBe(true)
    expect(statemachine.queryState((_state, data) => data)).toBe('data')
    expect(statemachine.queryState((state, _data) => state)).toBe(origstate)
  })
})

test('async change state to null makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (_creator, onCreated) => onCreated(null, origstatedata)).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeState((_state, _data, _callback) => newstatedata, (_err, _result) => {
    statemachine.changeState((_state, _data, _callback) => null, (_err, _result) => {
      expect(statemachine.queryState((_state, data) => data)).toEqual(newdata)
      expect(statemachine.queryState((state, _data) => state)).toBe(newstate)
    })
  })
})

test('async change state to same state makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (_creator) => origstatedata).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeState((_state, _data, _callback) => newstatedata, (_err, _result) => {
    statemachine.changeState((_state, _data, _callback) => newstatedata, (_err, _result) => {
      expect(statemachine.queryState((_state, data) => data)).toEqual(newdata)
      expect(statemachine.queryState((state, _data) => state)).toBe(newstate)
    })
  })
})

test('async change state to new state changes state', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (_creator) => origstatedata).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeState((_state, _data, _callback) => newstatedata, (_err, _result) => {
    var newerstate = { state: 'state3' }
    var newerdata = { data: 'data4' }
    var newerstatedata = { state: newerstate, data: newerdata }
    statemachine.changeState((_state, _data, _callback) => newerstatedata, (_err, _result) => {
      expect(statemachine.queryState((_state, data) => data)).toEqual(newerdata)
      expect(statemachine.queryState((state, _data) => state)).toBe(newerstate)
    })
  })
})

test('async initial setting of state does not persist callback', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var callback = sinon.fake()
  var statemachine = new sm.Builder('smname', null, (_creator) => origstatedata).withPersistance(callback).build()
  statemachine.changeState((_state, _data, _callback) => null, (_err, _result) => {
    assert(!callback.called)
  })
})

test('async change state to new state changes state calls persist callback', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var callback = sinon.fake()

  var statemachine = new sm.Builder('smname', null, (_creator, onCreated) => onCreated(null, origstatedata))
    .withPersistance(callback)
    .build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata, name: 'newstatename' }
  statemachine.changeState((_state, _data, _callback) => newstatedata, (_err, _result) => {
    assert(callback.called)
    // compare values, i.e. copied successfully
    assert(callback.calledWith('newstatename', newdata))
    // compare by reference, it should not match
    assert(!callback.calledWith('newstatename', sinon.match.same(newdata)))
  })
})
