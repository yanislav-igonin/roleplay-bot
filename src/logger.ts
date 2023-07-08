/* eslint-disable no-console */
const info = (...args: unknown[]) => console.log(args);
const error = (...args: unknown[]) => console.error(args);
/* eslint-enable no-console */

export const logger = {
  error,
  info,
};
