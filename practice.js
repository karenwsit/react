//todo reducer which takes each todo; a child reducer of todos reducer
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

////////////////////////////////////////////////////////
//Implementing React (View Layer)

const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});
const { createStore } = Redux;
const store = createStore(todoApp);

const { Component } = React; //base class for all objects

let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    return (
      <div>
        //React callback ref api is a function; it gets the node corresponding to the ref
        <input ref={node => {
          this.input = node;
        }} />
        <button onClick={ () => {
          //Common for React Compoments to dispatch actions in Redux apps
          //When an action is dispatched, store calls reducer that it was created with (todoApp) with current state & action
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = ''; //reset the value after dispatching action, so the input field is clear
        }}>
          Add Todo
        </button>
        <ul>
        //for every todo item, will show the list item of the text of that particular todo
        //TodoApp Component receive todos as a prop and maps to display list of todos using todo.id as key
        //this.props.todos will render the update todos
          {this.props.todos.map(todo =>
            <li key={todo.id}
              onClick={ () => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              }}
              style={{
                textDecoration:
                  todo.completed
                  ? 'line-through'
                  : 'none'
              }}>
              {todo.text}
            </li>
          )}
        </ul>
      </div>)
  }
}

//render function will update DOM in response to current state
const render = () => {
  ReactDOM.render(
    <ToDoApp
      todos={store.getState().todos} //the render func reads current state of the store, passes the todos array that it gets from the store to the ToDoApp Component as a prop
    />,
    document.getElementbyId('root') //will render into the root id div
  )
};

store.subscribe(render); //will call render whenever the store changes
render();


/////////////////////////////////////////////////////////
//Filtering Todos - Video 19

const setVisibilityFilters = (state = 'SHOW_ALL', action) => {
	switch ( action.type ) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state
	}
};

//FilterLink FUNCTIONAL Component
const FilterLink = ({
  filter, //accepts the filter prop
  currentFilter, //to style this
  children //contents of the link below
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>; //will then be unclickable; just static text and only show relevant filters
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        });
      }}
    >
      {children} //
    </a>
  )
}

//new function to filter
const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

class TodoApp extends Component {
  render() {
    //destruct first so we dont have to type this.props everytime
    const { todos, visibilityFilter } = this.props;
    //before rendering, get the visibleTodos
    const visibleTodos = getVisibleTodos(
      todos, //this.props.todos,
      visibilityFilter //this.props.visibilityFilter
    )
    return (
      <div>
        <input ref={node => {
          this.input = node;
        }} />
        <button onClick={ () => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          //in place of this.props.todos!!
          {visibleTodos.map(todo =>
            <li key={todo.id}
              onClick={ () => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              }}
              style={{
                textDecoration:
                  todo.completed
                  ? 'line-through'
                  : 'none'
              }}>
              {todo.text}
            </li>
          )}
        </ul>
        //populates 3 different links
        <p>
          Show:
          {' '}
          <FilterLink
            filter='SHOW_ALL'
            currentFilter={visibilityFilter}
          >
           All
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_ACTIVE'
            currentFilter={visibilityFilter}
          >
            Active
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_COMPLETED'
            currentFilter={visibilityFilter}
          >
            Completed
          </FilterLink>
        </p>
      </div>)
  }
}

const render = () => {
  ReactDOM.render(
    <ToDoApp
      {...store.getState()} //instead of passing the visibilityFilter prop expilicitly, pass every state field
    />,
    document.getElementbyId('root')
  )
};

store.subscribe(render);
render();
