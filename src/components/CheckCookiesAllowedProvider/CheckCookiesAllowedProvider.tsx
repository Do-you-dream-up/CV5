/**
 * Cookies disclaimer.
 */
interface CheckCookiesAllowedProviderProps {
  areCookiesAllowed?: boolean;
  children?: any;
}

export default function CheckCookiesAllowedProvider({ children, areCookiesAllowed }: CheckCookiesAllowedProviderProps) {
  return areCookiesAllowed ? children : null;
}
