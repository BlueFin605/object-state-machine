// My module
function Connected (statemachine) {
  this.name = 'connected'
  this.statemachine = statemachine
}

Connected.prototype.hangUp = function hangUp (data) {
  console.log(`sm event:hangup current state:${this.name}`)
  return this.statemachine.createNextState('onhook', data)
}

module.exports.Connected = Connected
