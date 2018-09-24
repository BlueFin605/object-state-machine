module.exports.StateChangePromise = function (statemachine, transition) {
  return new Promise(function (resolve, reject) {
    statemachine.changeStateAsync(transition, (err, result) => {
      if (err !== null) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
