# Object State Machine

A JavaScript State Machine where each state and it's data is represented by an object, where the emphasis is on the transitions between the states rather than what the current state is.  The key points to this state machine model are:
1. The current state and it's data is private to the statemachine and cannot be accessed externally, you trigger events or ask the statemachine to do something rather than query what state we are in.
2. Each state can have it's own data model, allowing the model to accurately represent the state making the statemachine easier to reason with.
3. The parameters can be different for the different events, allowing for flexible modeling of a variety of inputs 
4. Each state decides what state if any, an event will transition the state machine to 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installation

Working on it, coming soon

### Usage

Working on it, coming soon

## Dependencies
 * JavaScript
 
## To Do List
1. Finish README
2. Complete unit tests
3. Add proper logging
4. Add a fluent builder interface to create a statemachine
5. Type checking?
6. Enable child state machine to allow breaking up a larger entity into smaller orthogonal state machines

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D