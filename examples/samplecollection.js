var smcollection = require('../src/collections/statemachinecollection.js')
var sm = require('./statemachine.js')
var onhook = require('./states/stateonhook.js')
var dialtone = require('./states/statedialtone')
var offering = require('./states/stateoffering')
var ringback = require('./states/stateringback')
var connected = require('./states/stateconnected')

var states = {
  onhook: {
    create: function (statemachine) {
      return new onhook.OnHook(statemachine)
    }
  },
  dialtone: {
    create: function (statemachine) {
      return new dialtone.DialTone(statemachine)
    }
  },
  offering: {
    create: function (statemachine) {
      return new offering.Offering(statemachine)
    }
  },
  ringback: {
    create: function (statemachine) {
      return new ringback.RingBack(statemachine)
    }
  },
  connected: {
    create: function (statemachine) {
      return new connected.Connected(statemachine)
    }
  }
}

var statemachine = new sm.StateMachine('phone sm', states)
var statemachinecollection = new smcollection.StateMachineCollection('phone(s) sm', states)

console.log('Multi instance state machine')
console.log('============================')
statemachinecollection.addState('0x1', statemachine.createNextState('onhook', 'dataasstring'))
statemachinecollection.persistState((state, data) => { console.log(`phone(s) sm persist state ${state}:${data}`) })
statemachinecollection.changeState('0x1', (state, data) => state.offHook(data))
statemachinecollection.changeState('0x1', (state, data) => state.dial(data, '+64 (09) 123456'))
statemachinecollection.changeState('0x1', (state, data) => state.connected(data))
statemachinecollection.changeState('0x1', (state, data) => state.hangUp(data))
