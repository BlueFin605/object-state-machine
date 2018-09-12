var sm = require('../statemachine.js')

class StateMachineCollection {
  constructor (name, states) {
    this.collection = new Map()
    this.name = name
    this.states = states
  }
  addState (key, state) {
    if (this.collection.has(key)) {
      console.log(`${key} already exists in collection`)
      return
    }
    var statemachine = new sm.StateMachine(this.name, this.states)
    statemachine.setState(state)
    this.collection.set(key, statemachine)
  }
  persistState (callback) {
    for (var [key, value] of this.collection) {
      value.persistState((state, data) => callback(key, state, data))
    }
  }
  changeState (key, callback) {
    if (this.collection.has(key) === false) {
      console.log(`${key} does not exist in collection`)
      return
    }
    this.collection.get(key).changeState(callback)
  }
}

module.exports.StateMachineCollection = StateMachineCollection
