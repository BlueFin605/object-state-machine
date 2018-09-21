// My module
class OnHook {
  constructor (statemachine) {
    this.name = 'onHook'
    this.statemachine = statemachine
  }
  offHook (data, callback) {
    console.log(`sm event:offhook current state:${this.name}`)
    // var errMsg = 'this is my error'
    callback(null, this.statemachine.createNextState('dialtone', data))
  }
}

module.exports.OnHook = OnHook
