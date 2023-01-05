/**
 * Recursive flatten for step actions.
 */
export const flattenSteps = ({ nextStepResponse, ...rest }: { nextStepResponse?: any }) => [
  rest,
  ...(nextStepResponse ? flattenSteps(nextStepResponse) : []),
];
