export const uppercaseFirstLetter = (string) => {
  if (!Object.prototype.toString.call(string)) throw "ceci n'est pas une chaine de caractères";

  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};
