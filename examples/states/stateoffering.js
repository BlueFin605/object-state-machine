// My module
class Offering {
  constructor (statemachine) {
    this.name = 'offering'
    this.statemachine = statemachine
  }
  hangUp (data) {
    console.log(`sm event:hangup current state:${this.name}`)
    return this.statemachine.createNextState('onhook', data)
  }
}

module.exports.offering = Offering
