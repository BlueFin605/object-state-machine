const DefaultFactory = (function () {
  const _private = new WeakMap()

  const internal = (key) => {
    // Initialize if not created
    if (!_private.has(key)) {
      _private.set(key, {})
    }
    // Return private properties object
    return _private.get(key)
  }

  class DefaultFactory {
    static get Builder () {
      class Builder {
        constructor () {
          internal(this).states = new Map()
        }

        addState (name, factory) {
          internal(this).states.set(name, factory)
          return this
        }

        build () {
          var factory = new DefaultFactory()
          internal(this).states.forEach((value, key) => {
            factory[key] = { create: value }
          })

          return factory
        }
      }

      return Builder
    }
  }

  return DefaultFactory
}())

module.exports.Builder = DefaultFactory.Builder
