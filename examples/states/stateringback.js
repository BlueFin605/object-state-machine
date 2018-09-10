// My module
function RingBack (statemachine) {
  this.name = 'ringBack'
  this.statemachine = statemachine
}

RingBack.prototype.hangUp = function hangUp (data) {
  console.log(`sm event:hangup current state:${this.name}`)
  return this.statemachine.createNextState('onhook', data)
}

RingBack.prototype.connected = function connected (data) {
  console.log(`sm event:connected current state:${this.name}`)
  return this.statemachine.createNextState('connected', data)
}

module.exports.RingBack = RingBack
