// My module
class DialTone {
  constructor (statemachine) {
    this.statemachine = statemachine
    this.name = 'dialTone'
  }
  hangUp (data) {
    console.log(`sm event:hangup current state:${this.name}`)
    return this.statemachine.createNextState('onhook', data)
  }
  dial (data, number) {
    console.log(`sm event:dial current state:${this.name}`)
    return this.statemachine.createNextState('ringback', { number: number })
  }
}

module.exports.DialTone = DialTone
