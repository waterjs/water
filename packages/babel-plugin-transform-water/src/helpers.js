import capitalize from 'lodash.capitalize';

export { capitalize };

export function isCapitalized (string) {
  return capitalize(string) === string;
}
