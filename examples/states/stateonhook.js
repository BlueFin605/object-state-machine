// My module
class OnHook {
  constructor (statemachine) {
    this.name = 'onHook'
    this.statemachine = statemachine
  }
  offHook (data) {
    console.log(`sm event:offhook current state:${this.name}`)
    return this.statemachine.createNextState('dialtone', data)
  }
}

module.exports.OnHook = OnHook
