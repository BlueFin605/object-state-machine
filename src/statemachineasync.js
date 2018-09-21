// My module
const StateMachineAsync = (function () {
  const _private = new WeakMap()

  const internal = (key) => {
    // Initialize if not created
    if (!_private.has(key)) {
      _private.set(key, {})
    }
    // Return private properties object
    return _private.get(key)
  }

  function stateInitialised (err, initState, asynccallback, statemachine, callback) {
    if (err !== null) {
      console.log(`Initialisor error:<${err}>`)
      asynccallback(err, null)
      return
    }

    console.log(`sm[${internal(statemachine).name}] initialiser set state to ${initState.state.name}`)
    internal(statemachine).currentState = initState.state
    internal(statemachine).currentData = initState.data
    internal(statemachine).currentName = initState.name
    return callback()
  }

  function stateChanged (err, newState, asynccallback, statemachine) {
    if (err !== null) {
      console.log(`State change error:<${err}>`)
      asynccallback(err, null)
      return
    }

    if (newState === null || newState.state === null || newState.state === internal(statemachine).currentState) {
      asynccallback(null, true)
      return
    }

    console.log(`sm[${internal(statemachine).name}] changing state from ${internal(statemachine).currentState.name} to ${newState.state.name}`)
    internal(statemachine).currentState = newState.state
    internal(statemachine).currentData = newState.data
    internal(statemachine).currentName = newState.name

    if (internal(statemachine).persistStateCallback !== null) {
      // we want to send a copy since we want to prevent caller changing the state
      var dataCopy = JSON.parse(JSON.stringify(internal(statemachine).currentData))
      internal(statemachine).persistStateCallback(internal(statemachine).currentName, dataCopy, (err, result) => statePersisted(err, result, asynccallback))
    } else {
      asynccallback(null, true)
    }
  }

  function statePersisted (err, result, asynccallback) {
    if (err !== null) {
      console.log(`State persisted error:<${err}>`)
      asynccallback(err, null)
      return
    }

    asynccallback(null, true)
  }

  class StateMachineAsync {
    constructor (name, statesFactory, initialiser, persistState) {
      internal(this).name = name
      internal(this).statesFactory = statesFactory
      internal(this).currentState = null
      internal(this).currentData = {}
      internal(this).persistStateCallback = persistState
      internal(this).initialiser = initialiser
    }

    static get Builder () {
      class Builder {
        constructor (name, statesFactory, initialiser) {
          internal(this).name = name
          internal(this).statesFactory = statesFactory
          internal(this).initialiser = initialiser
          internal(this).persistance = null
        }

        withPersistance (persistance) {
          internal(this).persistance = persistance
          return this
        }

        withInitialiser (initialiser) {
          internal(this).initialiser = initialiser
          return this
        }

        build () {
          var sm = new StateMachineAsync(internal(this).name, internal(this).statesFactory, internal(this).initialiser, internal(this).persistance)
          return sm
        }

        buildWithName (overRideName) {
          var sm = new StateMachineAsync(overRideName, internal(this).statesFactory, internal(this).initialiser, internal(this).persistance)
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

    changeState (transition, asynccallback) {
      if (internal(this).currentState == null) {
        console.log(`sm[${internal(this).name}]creating initial state`)
        internal(this).initialiser(new Accessor(internal(this).statesFactory), (err, state) => stateInitialised(err, state, asynccallback, this, () => this.changeState(transition, asynccallback)))
        return
      }

      // take a copy of the data, so if a state wants to chnage it, it needs to chnage state(to itself if necessary)
      var dataCopy = JSON.parse(JSON.stringify(internal(this).currentData))
      transition(internal(this).currentState, dataCopy, (err, state) => stateChanged(err, state, asynccallback, this))
    }

    queryState (query, asynccallback) {
      if (internal(this).currentState == null) {
        console.log(`sm[${internal(this).name}] creating initial state`)
        internal(this).initialiser(new Accessor(internal(this).statesFactory), (err, state) => stateInitialised(err, state, asynccallback, this, () => this.queryState(query, asynccallback)))
      }

      // take a copy of the data, so if a state wants to chnage it, it needs to chnage state(to itself if necessary)
      var dataCopy = JSON.parse(JSON.stringify(internal(this).currentData))
      return query(internal(this).currentState, dataCopy)
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
        name: name,
        data: data
      }
    }
  }

  return StateMachineAsync
}())

// module.exports.StateMachine = StateMachine
module.exports.Builder = StateMachineAsync.Builder
