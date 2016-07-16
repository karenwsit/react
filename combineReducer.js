//Implementation of combineReducer utility function that returns another function

//reduce method applies a function against an accumulator & each value of the array from L-to-R to reduce to a single value
//arr.reduce(callback[, initialValue])
//[0, 1, 2, 3, 4].reduce( (prev, curr) => prev + curr );

const combineReducers = (reducers) => {
  return (state= {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](
          state[key],
          action
        );
        return nextState;
      }
      {}
    )
  };
};
