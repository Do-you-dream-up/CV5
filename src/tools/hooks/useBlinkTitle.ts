import { useEffect, useState } from 'react';

interface BlinkingProps {
  title: string;
  trigger: any;
  interval?: number;
}

const useBlinkTitle = ({ title = document.title, trigger, interval = 500 }: BlinkingProps) => {
  console.log('🚀 ~ file: useBlinkTitle.ts:10 ~ useBlinkTitle ~ trigger', trigger);
  const [isBlinking, setIsBlinking] = useState(false);
  let id = 0;

  useEffect(() => {
    changeTitle();
  }, []);

  useEffect(() => {
    if (document.title === title) {
      document.title = title;
    }
    if (id) window.clearTimeout(id);
  }, [title]);

  const changeTitle = () => {
    if (document.title !== title) {
      title = document.title;
      document.title = title;
    } else {
      document.title = title;
    }
    id = window.setTimeout(changeTitle, interval);
  };

  return {
    isBlinking,
  };
};

export default useBlinkTitle;
