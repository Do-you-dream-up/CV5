/**
 * Recursive flatten for step actions.
 */
export const flattenSteps = ({ nextStepResponse: next, ...rest }) => [rest, ...(next ? flattenSteps(next) : [])];
