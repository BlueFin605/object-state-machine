var sm = require('../src/index.js')
var onhook = require('./states/stateonhook.js')
var dialtone = require('./states/statedialtone')
var offering = require('./states/stateoffering')
var ringback = require('./states/stateringback')
var connected = require('./states/stateconnected')

var statesFactory = {
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

var statemachine = new sm.StateMachine.Builder('phone sm', statesFactory, (creator) => creator.createNextState('onhook', null))
  .withPersistance((state, data) => { console.log(`phone sm persist state ${state.name}:${data}`) })
  .build()

console.log('Single instance state machine')
console.log('=============================')
statemachine.changeState((state, data) => state.offHook(data))
statemachine.changeState((state, data) => state.dial(data, '+64 (09) 123456'))
statemachine.changeState((state, data) => state.connected(data))
statemachine.changeState((state, data) => state.hangUp(data))
