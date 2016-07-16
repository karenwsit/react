//todo reducer which takes each todo
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
          id: action.id
          text: action.text
          completed: false
        };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

//todos reducer that takes in all the todos in our state area and calls the todo reducer function
const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
}

//Test our addToDo
const testAddTodo = () => {
  const stateBefore = []
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];
  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todo(stateBefore, action)
  ).toEqual(stateAfter)
}

////////////////////////////////////////////////////////////////////

const { createStore } = Redux;
const store = createStore(todos);

console.log('Initial State:', store.getState()) // Initial State: []

//dispatching add_todo
store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
});

console.log('Current State:,' store.getState()) // Current State: [[object Object] {completed: false}, id: 0, text: "Learn Redux" }]

//dispatching TOGGLE_TODO
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
});

console.log('Current State:,' store.getState()) // Current State: [[object Object] {completed: true}, id: 0, text: "Learn Redux" }]


//How to Store More Information such as a Visibility Filter:

const setVisibilityFilters = (state = 'SHOW_ALL', action) => {
	switch ( action.type ) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state
	}
};

// const toDoApp = (state = {}, action) => {
//   return {
//     todos: todos(
//       state.todos,
//       action
//     ),
//     visibilityFilter: visibilityFilter(
//       state.visibilityFilter,
//       action
//     )
//   };
// };

const { createStore } = Redux;
const store = createStore(todoApp);

//combineReducers() -avoid writing toDoApp reducer by hand; replaces the commented out code above
//Generate single reducer that calls many reducers to manage different parts of the state by using combineReducer utility function

const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos: todos, // key = state.todos & value = reducers that it calls
  visibilityFilter: visiblityFilter
})

//ES6 - object literal shorthand notation
const todoApp = combineReducers({
  todos,
  visibilityFilter
})
