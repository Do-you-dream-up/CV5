/**
 * Recursive flatten for step actions.
 */
const flatten = ({ nextStepResponse: next, ...rest }) => [
  rest,
  ...(next ? flatten(next) : []),
];
export default flatten;
