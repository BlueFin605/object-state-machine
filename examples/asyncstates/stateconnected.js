// My module
class Connected {
  constructor (statemachine) {
    this.name = 'connected'
    this.statemachine = statemachine
  }
  hangUp (data, callback) {
    console.log(`sm event:hangup current state:${this.name}`)
    callback(null, this.statemachine.createNextState('onhook', data))
  }
}

module.exports.Connected = Connected
