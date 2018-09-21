// My module
class Offering {
  constructor (statemachine) {
    this.name = 'offering'
    this.statemachine = statemachine
  }

  hangUp (data, callback) {
    console.log(`sm event:hangup current state:${this.name}`)
    callback(null, this.statemachine.createNextState('onhook', data))
  }
}

module.exports.offering = Offering
