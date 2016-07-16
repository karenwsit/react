const todo = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id
          text: action.text
          completed: false
        }
      ];
    default:
      return state;
  }
};

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


const setVisibilityFilters = (state = 'SHOW_ALL', action) => {
	switch ( action.type ) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state
	}
};

const toDoApp = (state = {}, action) => {
  return {
    todos: todos(
      state.todos,
      action
    ),
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  };
};
