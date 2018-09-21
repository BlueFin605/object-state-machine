// My module
class DialTone {
  constructor (statemachine) {
    this.statemachine = statemachine
    this.name = 'dialTone'
  }
  hangUp (data, callback) {
    console.log(`sm event:hangup current state:${this.name}`)
    callback(null, this.statemachine.createNextState('onhook', data))
  }
  dial (data, callback, number) {
    console.log(`sm event:dial current state:${this.name}`)
    callback(null, this.statemachine.createNextState('ringback', { number: number }))
  }
}

module.exports.DialTone = DialTone
