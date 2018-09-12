// My module
class Connected {
  constructor (statemachine) {
    this.name = 'connected'
    this.statemachine = statemachine
  }
  hangUp (data) {
    console.log(`sm event:hangup current state:${this.name}`)
    return this.statemachine.createNextState('onhook', data)
  }
}

module.exports.Connected = Connected
