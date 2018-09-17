var StateMachine = require('./statemachine.js')

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
    constructor (name, initialiser, stateMachineBuilder) {
      internal(this).collection = new Map()
      internal(this).name = name
      internal(this).initialiser = initialiser
      internal(this).builder = stateMachineBuilder
    }

    static get Builder () {
      class Builder {
        constructor (name, statesFactory, initialiser) {
          internal(this).name = name
          internal(this).initialiser = initialiser
          internal(this).builder = new StateMachine.Builder(name, statesFactory, null)
        }

        withPersistance (persistance) {
          internal(this).builder = internal(this).builder.withPersistance(persistance)
          return this
        }

        build () {
          var sm = new StateMachineCollection(internal(this).name, internal(this).initialiser, internal(this).builder)
          return sm
        }
      }

      return Builder
    }

    changeState (key, callback) {
      if (internal(this).collection.has(key) === false) {
        // modify this builder to have a initialiser that passes the key
        var thisBuilder = internal(this).builder.withInitialiser((creator) => internal(this).initialiser(key, creator))
        internal(this).collection.set(key, thisBuilder.buildWithName(`${internal(this).name}:${key}`))
      }

      internal(this).collection.get(key).changeState(callback)
    }
  }

  return StateMachineCollection
}())

// module.exports.StateMachineCollection = StateMachineCollection
module.exports.Builder = StateMachineCollection.Builder
