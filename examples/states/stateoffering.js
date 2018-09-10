// My module
function Offering (statemachine) {
  this.name = 'offering'
  this.statemachine = statemachine
}

Offering.prototype.hangUp = function hangUp (data) {
  console.log(`sm event:hangup current state:${this.name}`)
  return this.statemachine.createNextState('onhook', data)
}

module.exports.offering = Offering
