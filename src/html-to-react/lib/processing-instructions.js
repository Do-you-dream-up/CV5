'use strict';
import shouldProcessEveryNode from './should-process-node-definitions';
import processNodeDefinitions from './process-node-definitions';

export function processingInstructions() {
  return {
    defaultProcessingInstructions: [
      {
        shouldProcessNode: shouldProcessEveryNode,
        processNode: processNodeDefinitions,
      },
    ],
  };
}
