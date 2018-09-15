# Object State Machine

A JavaScript State Machine where each state and it's data is represented by an object, where the emphasis is on the transitions between the states rather than what the current state is.  The key points to this state machine model are:
1. The current state and it's data is private to the statemachine and cannot be accessed externally, you trigger events or ask the statemachine to do something rather than query what state we are in.
2. Each state can have it's own data model, allowing the model to accurately represent the state making the statemachine easier to reason with.
3. The parameters can be different for the different events, allowing for flexible modeling of a variety of inputs 
4. Each state decides what state if any, an event will transition the state machine to 

### Installation

Using npm:

```shell
  npm install --save-dev object-state-machine
```

In Node.js:

```javascript
  var statemachine = require('object-state-machine');
```

### Usage

#### State Machine

##### 1. Create a factory object
A factory object needs to be implemented that will instantiate each of the different states, each property has a function to create the object that represents the state.

```shell
var statesFactory = {
  connected: {
    create: function (statemachine) {
      return new Connected(statemachine)
    }
  },
  disconnected: {
    create: function (statemachine) {
      return new Disconnected(statemachine)
    }
  },
  dropping: {
    create: function (statemachine) {
      return new Dropping(statemachine)
    }
  }
}
```

##### 2. Create a class for each state
Each state is represented by an object and each object implements the events that it needs to handle, returning either the next state if it wants to transition to a new state or return null or this to not transistion.  The next state is constructed using the createNextState function which takes the name of the state and any data you wish to store.  If the state wishes to change the data associated with the state, it needs to transition to a new state, which could be a new instance of the same type. 

```shell
class Connected {
  constructor (statemachine) {
    this.name = 'disconnected'
    this.statemachine = statemachine
  }

  onDisconnected (data, reason) {
    console.log(`sm event:ondisconnected current state:${this.name}`)
    return this.statemachine.createNextState('disconnected', reason)
  }

  dropConnection (data) {
    console.log(`sm event:dropconnection current state:${this.name}`)
    return this.statemachine.createNextState('dropping', null)
  }
}
```


##### 3. Create a instance of the state machine
The state machine is constructed using the fluent builder, passing in a name that will represent the state machine in logging, the state factory. and a function to create the initial state.  The creator is the instance of the statemachine so you can call createNextState to initialise the statemachine, this gets called the first tine an event is fired.

```shell
var sm = new statemachine.StateMachine.Builder('sample state machine', statesFactory, (creator) => creator.createNextState('disconnected', 'not connected'))
  .build()

```

##### 4. Fire events into the state machine
Events are fired against the state machine, because the state and it's data is internal to the state machine the only way you can interact with either is by firing events on the state machine.  Each event can have it's own unique parameters allowing support to a range of events from different sources.  The current state and it's data is passed to the callback allowing you to choose what event to call and to pass it's data along with any additional information that is relevent to the event.

```shell
sm.changeState((state, data) => state.onDisconnected(data, 'shutdown'))
sm.changeState((state, data) => state.dropConnection(data))
```

#### State Machine Collection

Sometimes you need t omanage a collection of state machines, so trhe StateMachineCollection is a simple warpper aund the StateMachine which manages this collection.

You create the factory and state instances as you do above for the single instance of a StateMachine.


##### 1. Create a instance of the state machine
The SatteMachineCollection is built using a Fluent Builder in a similar way to the StateMachine.

```shell
var sm = new StateMachine.StateMachineCollection.Builder('phone(s) sm', stateFactory, (creator) => creator.createNextState('onhook', null))
  .build()

```

##### 2. Fire events into the state machine
Events are fired in the same was a a stand-alone statemachine, except you supply the key to the collection to identify the instance you wish to modify.

```shell
sm.changeState('0x1',(state, data) => state.onDisconnected(data, 'shutdown'))
sm.changeState('0x1',(state, data) => state.dropConnection(data))
```

#### Persistance
If you wish to persist the state of the state machine to storage somewhere you can supply a callback which gets called whenever the state machine transistions.  This applies to both stand-alone and collection state machine implementations

statemachine.persistState((state, data) => { console.log(`we can save to state:${state.name} and it's data:${data} somewhere`)})



## Dependencies
 * JavaScript
 
## To Do List
1. Complete unit tests
2. Add proper logging
3. Enable child state machine to allow breaking up a larger entity into smaller orthogonal state machines

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D