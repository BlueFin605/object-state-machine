var smcollection = require('../src/collections/index.js')
var onhook = require('./states/stateonhook.js')
var dialtone = require('./states/statedialtone')
var offering = require('./states/stateoffering')
var ringback = require('./states/stateringback')
var connected = require('./states/stateconnected')

var stateFactory = {
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

var statemachinecollection = new smcollection.Builder('phone(s) sm', stateFactory, (creator) => creator.createNextState('onhook', null))
  .withPersistance((state, data) => { console.log(`phone(s) sm persist state ${state.name}:${data}`) })
  .build()

console.log('Multi instance state machine')
console.log('============================')
// statemachinecollection.initialiseState('0x1', (creator) => creator.createNextState('onhook', 'dataasstring'))
// statemachinecollection.persistState((key, state, data) => { console.log(`phone(s) sm persist state ${key}:${state.name}:${data}`) })
statemachinecollection.changeState('0x1', (state, data) => state.offHook(data))
statemachinecollection.changeState('0x1', (state, data) => state.dial(data, '+64 (09) 123456'))
statemachinecollection.changeState('0x1', (state, data) => state.connected(data))
statemachinecollection.changeState('0x1', (state, data) => state.hangUp(data))
