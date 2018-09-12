// My module
class RingBack {
  constructor (statemachine) {
    this.name = 'ringBack'
    this.statemachine = statemachine
  }
  hangUp (data) {
    console.log(`sm event:hangup current state:${this.name}`)
    return this.statemachine.createNextState('onhook', data)
  }
  connected (data) {
    console.log(`sm event:connected current state:${this.name}`)
    return this.statemachine.createNextState('connected', data)
  }
}

module.exports.RingBack = RingBack
