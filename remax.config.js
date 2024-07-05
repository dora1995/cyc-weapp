/* eslint-disable */

const path = require('path')
const sass = require('@remax/plugin-sass');

function resolve (dir) {
  return path.join(__dirname, dir)
}

// https://remaxjs.org/guide/config/remax#configwebpack
module.exports = {
  one: true,
  pxToRpx: false,
  output: 'dist/' + process.env.REMAX_PLATFORM,
  plugins: [sass()],
  configWebpack({ config, webpack }) {
    config.plugin('custom-define').use(webpack.DefinePlugin, [{
      GITHUB_RUN_NUMBER: JSON.stringify(process.env.GITHUB_RUN_NUMBER || ''),
      PACKAGE_VERSION: JSON.stringify(process.env.PACKAGE_VERSION || ''),
    }]);

    // wxLog
    config.resolve.alias.set('wx-log', resolve('src/utils/wx-log'))
    config.plugin('custom-define').use(webpack.ProvidePlugin, [{
      wxLog: ['wx-log', 'default']
    }])
  }
};
