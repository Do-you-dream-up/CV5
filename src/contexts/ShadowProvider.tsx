import { ReactElement, createContext, useContext, useMemo, useState } from 'react';

interface ShadowContextProps {
  shadowAnchor?: HTMLDivElement;
  shadowRoot?: ShadowRoot | null;
}

interface ShadowProviderProps {
  children?: ReactElement;
  root: HTMLDivElement;
  shadow: ShadowRoot;
}

export const useShadow = () => useContext(ShadowContext);

const ShadowContext = createContext<ShadowContextProps>({});

export default function ShadowProvider({ children, root, shadow }: ShadowProviderProps) {
  const [shadowAnchor] = useState<HTMLDivElement>(root);
  const [shadowRoot] = useState<ShadowRoot>(shadow);

  const context = useMemo(
    () => ({
      shadowAnchor: shadowAnchor,
      shadowRoot: shadowRoot,
    }),
    [shadowAnchor, shadowRoot],
  );

  return <ShadowContext.Provider value={context}>{children}</ShadowContext.Provider>;
}
