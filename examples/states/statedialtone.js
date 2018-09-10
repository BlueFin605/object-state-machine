// My module
function DialTone (statemachine) {
  this.statemachine = statemachine
  this.name = 'dialTone'
}

DialTone.prototype.hangUp = function hangUp (data) {
  console.log(`sm event:hangup current state:${this.name}`)
  return this.statemachine.createNextState('onhook', data)
}

DialTone.prototype.dial = function dial (data, number) {
  console.log(`sm event:dial current state:${this.name}`)
  return this.statemachine.createNextState('ringback', { number: number })
}

module.exports.DialTone = DialTone
