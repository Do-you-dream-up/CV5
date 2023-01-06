import { ReactElement, createContext } from 'react';

interface DragonContextProps {
  children?: ReactElement;
  onDrag?: () => void;
  onDragStart?: () => void;
}

interface DragonProviderProps extends DragonContextProps {}

export const DragonContext = createContext<DragonContextProps>({});

export const DragonProvider = ({ children, onDrag, onDragStart }: DragonProviderProps) => {
  return <DragonContext.Provider children={children} value={{ onDrag, onDragStart }} />;
};
