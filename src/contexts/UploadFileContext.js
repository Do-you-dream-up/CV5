import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDialog } from './DialogContext';

const UploadFileContext = React.createContext();
export const useUploadFile = () => React.useContext(UploadFileContext);

export default function UploadFileProvider({ children }) {
  const { showUploadFileButton: appendButtonUploadFileAsInteraction } = useDialog();

  const dataContext = useMemo(() => {
    return {
      showUploadFileButton: appendButtonUploadFileAsInteraction,
    };
  }, []);

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
}

UploadFileProvider.propTypes = {
  children: PropTypes.node,
};
