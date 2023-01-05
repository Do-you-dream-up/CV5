export const isNull = (variable) => variable === null;
export const isUndefined = (variable) => typeof variable === 'undefined';
export const isDefined = (variable) => !isNull(variable) && !isUndefined(variable);
