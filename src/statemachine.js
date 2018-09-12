// My module
class StateMachine {
  constructor (name, statesFactory) {
    this.name = name
    this.statesFactory = statesFactory
    this.currentState = null
    this.currentData = {}
    this.persistStateCallback = null
  }
  setState (state) {
    console.log(`sm set state to ${state.name}`)
    this.currentState = state.state
    this.currentData = state.data
  }
  persistState (callback) {
    this.persistStateCallback = callback
  }
  changeState (callback) {
    // take a copy of the data, so if a state wants to chnage it, it needs to chnage state(to itself if necessary)
    var dataCopy = JSON.parse(JSON.stringify(this.currentData))
    var newState = callback(this.currentState, dataCopy)
    if (newState === null || newState.state === null) {
      return
    }
    if (newState.state === this.currentState) {
      return
    }
    console.log(`sm changing state from ${this.currentState.name} to ${newState.state.name}`)
    this.currentState = newState.state
    this.currentData = newState.data
    if (this.persistStateCallback !== null) {
      // we want to send a copy since we want to prevent caller changing the state
      dataCopy = JSON.parse(JSON.stringify(this.currentData))
      this.persistStateCallback(this.currentState, dataCopy)
    }
  }
  createNextState (name, data) {
    // console.log(`create next state of ${name}:${data}`);
    return {
      state: this.statesFactory[name].create(this),
      data: data
    }
  }
}

module.exports.StateMachine = StateMachine
