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

  var statemachine = new sm.Builder('smname', statesFactory, (creator, callback) => callback(null, creator.createNextState('onhook', null))).build()
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

  statemachine.changeStateAsync((_state, _data, _callback) => null, (err, result) => {
    console.log(`${err}, ${result}`)
    expect('createNextState' in calledcreateor).toBe(true)
    expect(statemachine.queryStateAsync((_state, data) => data)).toBe('data')
    expect(statemachine.queryStateAsync((state, _data) => state)).toBe(origstate)
  })
})

test('async change state to null makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (_creator, onCreated) => onCreated(null, origstatedata)).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeStateAsync((_state, _data, callback) => callback(null, newstatedata), (_err, _result) => {
    statemachine.changeStateAsync((_state, _data, callback) => callback(null, null), (_err, _result) => {
      expect(statemachine.queryStateAsync((_state, data) => data)).toEqual(newdata)
      expect(statemachine.queryStateAsync((state, _data) => state)).toBe(newstate)
    })
  })
})

test('async change state to same state makes no change', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (creator, callback) => callback(null, origstatedata)).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeStateAsync((_state, _data, callback) => callback(null, newstatedata), (_err, _result) => {
    statemachine.changeStateAsync((_state, _data, callback) => callback(null, newstatedata), (_err, _result) => {
      expect(statemachine.queryStateAsync((_state, data) => data)).toEqual(newdata)
      expect(statemachine.queryStateAsync((state, _data) => state)).toBe(newstate)
    })
  })
})

test('async change state to new state changes state', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var statemachine = new sm.Builder('smname', null, (creator, callback) => callback(null, origstatedata)).build()
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  statemachine.changeStateAsync((_state, _data, callback) => callback(null, newstatedata), (_err, _result) => {
    var newerstate = { state: 'state3' }
    var newerdata = { data: 'data4' }
    var newerstatedata = { state: newerstate, data: newerdata }
    statemachine.changeStateAsync((_state, _data, callback) => callback(null, newerstatedata), (_err, _result) => {
      expect(statemachine.queryStateAsync((_state, data) => data)).toEqual(newerdata)
      expect(statemachine.queryStateAsync((state, _data) => state)).toBe(newerstate)
    })
  })
})

test('async initial setting of state does not persist callback', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var callback = sinon.fake()
  var statemachine = new sm.Builder('smname', null, (creator, callback) => callback(null, origstatedata)).withPersistance(callback).build()
  statemachine.changeStateAsync((_state, _data, callback) => { callback(null, null) }, (_err, _result) => {
    assert(!callback.called)
  })
})

test('async transition failure returns error', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var callback = sinon.fake()
  var errResult = 'this is the error'
  var statemachine = new sm.Builder('smname', null, (creator, callback) => callback(null, origstatedata)).withPersistance(callback).build()
  statemachine.changeStateAsync((_state, _data, callback) => { callback(errResult, null) }, (err, _result) => {
    expect(err).toEqual(errResult)
  })
})

test('async persistance failure returns error', () => {
  var origstate = { state: 'state' }
  var origstatedata = { state: origstate, data: 'data' }
  var errResult = 'this is the error'
  var newstate = { state: 'state2' }
  var newdata = { data: 'data3' }
  var newstatedata = { state: newstate, data: newdata }
  var statemachine = new sm.Builder('smname', null, (creator, callback) => callback(null, origstatedata)).withPersistance((state, data, callback) => { callback(errResult, null) }).build()
  statemachine.changeStateAsync((_state, _data, callback) => { callback(null, newstatedata) }, (err, _result) => {
    expect(err).toEqual(errResult)
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
  statemachine.changeStateAsync((_state, _data, _callback) => newstatedata, (_err, _result) => {
    assert(callback.called)
    // compare values, i.e. copied successfully
    assert(callback.calledWith('newstatename', newdata))
    // compare by reference, it should not match
    assert(!callback.calledWith('newstatename', sinon.match.same(newdata)))
  })
})
