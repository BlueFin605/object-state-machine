// My module
function OnHook (statemachine) {
  this.name = 'onHook'
  this.statemachine = statemachine
}

OnHook.prototype.offHook = function offHook (data) {
  console.log(`sm event:offhook current state:${this.name}`)
  return this.statemachine.createNextState('dialtone', data)
}

module.exports.OnHook = OnHook
