/* eslint-disable */
module.exports = {
  viewportWidth: 375, // (Number) The width of the viewport.
  viewportHeight: 667, // (Number) The height of the viewport.
  unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
  viewportUnit: 'vw', // (String) Expected units.
  selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
  minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
  exclude: [new RegExp('node_modules')],
  mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
}
