// My module
class RingBack {
  constructor (statemachine) {
    this.name = 'ringBack'
    this.statemachine = statemachine
  }
  hangUp (data, callback) {
    console.log(`sm event:hangup current state:${this.name}`)
    callback(null, this.statemachine.createNextState('onhook', data))
  }
  connected (data, callback) {
    console.log(`sm event:connected current state:${this.name}`)
    callback(null, this.statemachine.createNextState('connected', data))
  }
}

module.exports.RingBack = RingBack
