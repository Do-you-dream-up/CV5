import { useCallback, useEffect, useState } from 'react';

const MESSAGE_STRING = 'Ce champs est requis';

export default function useMessageFieldRequired(field, showRequiredMessage) {
  const [show, setShow] = useState(showRequiredMessage || field.isShowingRequiredMessage());
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setMessage(show ? MESSAGE_STRING : null);
  }, [show]);

  const hideMessage = useCallback(() => {
    field.turnOffShowingRequiredMessage();
    setShow(false);
  }, []);

  const showMessage = useCallback(() => {
    field.turnOnShowingRequiredMessage();
    setShow(true);
  }, []);

  useEffect(() => {
    field.setUiCallbackShowRequiredMessage(showMessage);
    field.setUiCallbackHideRequiredMessage(hideMessage);
  }, [field]);

  return {
    message,
  };
}
