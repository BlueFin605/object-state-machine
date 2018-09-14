var StateMachine = require('../statemachine.js')

const StateMachineCollection = (function () {
  const _private = new WeakMap()

  const internal = (key) => {
    // Initialize if not created
    if (!_private.has(key)) {
      _private.set(key, {})
    }
    // Return private properties object
    return _private.get(key)
  }

  class StateMachineCollection {
    constructor (name, stateMachineBuilder) {
      internal(this).collection = new Map()
      internal(this).name = name
      internal(this).builder = stateMachineBuilder
    }

    static get Builder () {
      class Builder {
        constructor (name, statesFactory, initialStateCreator) {
          internal(this).builder = new StateMachine.Builder(name, statesFactory, initialStateCreator)
        }

        withPersistance (persistance) {
          internal(this).builder = internal(this).builder.withPersistance(persistance)
          return this
        }

        build () {
          var sm = new StateMachineCollection(internal(this).name, internal(this).builder)
          return sm
        }
      }

      return Builder
    }

    // initialiseState (key, callback) {
    //   if (internal(this).collection.has(key)) {
    //     console.log(`${key} already exists in collection`)
    //     return
    //   }
    //   var statemachine = new sm.StateMachine(`${internal(this).name}:${key}`, internal(this).states, (creator) => callback(creator))
    //   internal(this).collection.set(key, statemachine)
    // }

    // persistState (callback) {
    //   for (var [key, value] of internal(this).collection) {
    //     value.persistState((state, data) => callback(key, state, data))
    //   }
    // }

    changeState (key, callback) {
      if (internal(this).collection.has(key) === false) {
        internal(this).collection.set(key, internal(this).builder.build())
      }

      internal(this).collection.get(key).changeState(callback)
    }
  }

  return StateMachineCollection
}())

// module.exports.StateMachineCollection = StateMachineCollection
module.exports.Builder = StateMachineCollection.Builder
