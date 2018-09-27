var sm = require('../src/index.js')
var pm = require('../src/asyncpromises')
var onhook = require('./asyncstates/stateonhook.js')
var dialtone = require('./asyncstates/statedialtone')
var offering = require('./asyncstates/stateoffering')
var ringback = require('./asyncstates/stateringback')
var connected = require('./asyncstates/stateconnected')

// var statesFactory = {
//   onhook: {
//     create: function (statemachine) {
//       return new onhook.OnHook(statemachine)
//     }
//   },
//   dialtone: {
//     create: function (statemachine) {
//       return new dialtone.DialTone(statemachine)
//     }
//   },
//   offering: {
//     create: function (statemachine) {
//       return new offering.Offering(statemachine)
//     }
//   },
//   ringback: {
//     create: function (statemachine) {
//       return new ringback.RingBack(statemachine)
//     }
//   },
//   connected: {
//     create: function (statemachine) {
//       return new connected.Connected(statemachine)
//     }
//   }
// }

var stateFactory = new sm.DefaultFactory.Builder()
  .addState('onhook', (statemachine) => new onhook.OnHook(statemachine))
  .addState('dialtone', (statemachine) => new dialtone.DialTone(statemachine))
  .addState('offering', (statemachine) => new offering.Offering(statemachine))
  .addState('ringback', (statemachine) => new ringback.RingBack(statemachine))
  .addState('connected', (statemachine) => new connected.Connected(statemachine))
  .build()

var statemachine = new sm.StateMachineAsync.Builder('phone sm', stateFactory, (creator, callback) => callback(null, creator.createNextState('onhook', null)))
  .withPersistance((state, data, callback) => {
    console.log(`phone sm persist state ${state}:${data}`)
    // var errMsg = 'this is my error'
    callback(null, true)
  })
  .handleInvalidTransitions(true)
  .build()

console.log('Single Async instance state machine')
console.log('===================================')
chainStateChange((state, data, callback) => state.offHook(data, callback),
  () => chainStateChange((state, data, callback) => state.dial(data, callback, '+64 (09) 123456'),
    () => chainStateChange((state, data, callback) => state.connected(data, callback),
      () => chainStateChange((state, data, callback) => state.hangUp(data, callback), null))))

console.log('Single Async instance state machine using promises')
console.log('==================================================')
pm.StateChangePromise(statemachine, (state, data, callback) => state.offHook(data, callback)).then(function handlechange (results) {
  console.log(`result from state transition:[${results}]`)
  pm.StateChangePromise(statemachine, (state, data, callback) => state.dial(data, callback, '+64 (09) 123456')).then(function handlechange (results) {
    console.log(`result from state transition:[${results}]`)
  })
})

function chainStateChange (transition, next) {
  statemachine.changeStateAsync(transition, (err, result) => {
    if (err !== null) {
      console.log(`error transitioning:<${err}>`)
      if (next !== null) {
        next()
      }
      return
    }

    console.log(`successful transition:<${result}>`)
    if (next !== null) {
      next()
    }
  })
}
