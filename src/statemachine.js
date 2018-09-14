// My module
const StateMachine = (function () {
  const _private = new WeakMap()

  const internal = (key) => {
    // Initialize if not created
    if (!_private.has(key)) {
      _private.set(key, {})
    }
    // Return private properties object
    return _private.get(key)
  }

  class StateMachine {
    constructor (name, statesFactory, initialStateCreator, persistState) {
      internal(this).name = name
      internal(this).statesFactory = statesFactory
      internal(this).currentState = null
      internal(this).currentData = {}
      internal(this).persistStateCallback = persistState
      internal(this).initialStateCreator = initialStateCreator
    }

    static get Builder () {
      class Builder {
        constructor (name, statesFactory, initialStateCreator) {
          internal(this).name = name
          internal(this).statesFactory = statesFactory
          internal(this).initialStateCreator = initialStateCreator
          internal(this).persistance = null
        }

        withPersistance (persistance) {
          internal(this).persistance = persistance
          return this
        }

        build () {
          var sm = new StateMachine(internal(this).name, internal(this).statesFactory, internal(this).initialStateCreator, internal(this).persistance)
          return sm
        }
      }

      return Builder
    }

    getName () {
      return internal(this).name
    }

    getStatesFactory () {
      return internal(this).statesFactory
    }

    getPersistStateCallback () {
      return internal(this).persistStateCallback
    }

    changeState (callback) {
      if (internal(this).currentState == null) {
        console.log(`createing initial state for  ${internal(this).name}`)
        var initState = internal(this).initialStateCreator(new Accessor(internal(this).statesFactory))
        console.log(`sm set state to ${initState.state.name}`)
        internal(this).currentState = initState.state
        internal(this).currentData = initState.data
      }

      // take a copy of the data, so if a state wants to chnage it, it needs to chnage state(to itself if necessary)
      var dataCopy = JSON.parse(JSON.stringify(internal(this).currentData))
      var newState = callback(internal(this).currentState, dataCopy)
      if (newState === null || newState.state === null || newState.state === internal(this).currentState) {
        return
      }

      console.log(`sm changing state from ${internal(this).currentState.name} to ${newState.state.name}`)
      internal(this).currentState = newState.state
      internal(this).currentData = newState.data

      if (internal(this).persistStateCallback !== null) {
        // we want to send a copy since we want to prevent caller changing the state
        dataCopy = JSON.parse(JSON.stringify(internal(this).currentData))
        internal(this).persistStateCallback(internal(this).currentState, dataCopy)
      }
    }

    queryState (callback) {
      if (internal(this).currentState == null) {
        console.log(`createing initial state for  ${internal(this).name}`)
        var initState = internal(this).initialStateCreator(this)
        console.log(`sm set state to ${initState.state.name}`)
        internal(this).currentState = initState.state
        internal(this).currentData = initState.data
      }

      // take a copy of the data, so if a state wants to chnage it, it needs to chnage state(to itself if necessary)
      var dataCopy = JSON.parse(JSON.stringify(internal(this).currentData))
      return callback(internal(this).currentState, dataCopy)
    }
  }

  class Accessor {
    constructor (statesFactory) {
      this.statesFactory = statesFactory
    }

    createNextState (name, data) {
      // console.log(`create next state of ${name}:${data}`);
      return {
        state: this.statesFactory[name].create(this),
        data: data
      }
    }
  }

  return StateMachine
}())

// module.exports.StateMachine = StateMachine
module.exports.Builder = StateMachine.Builder
