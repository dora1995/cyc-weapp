/* eslint-disable */

const px2viewportConfig = require('./src/px2viewport.config')

module.exports = ({ options }) => ({
  plugins: {
    // 应用 remax 默认的插件配置
    ...options.plugins,
    // 'postcss-url': { url: 'inline', maxSize: 15 },
    'postcss-aspect-ratio-mini': {},
    'postcss-cssnext': {},
    'postcss-px-to-viewport': {
      ...px2viewportConfig
    },
    cssnano: {
      preset: 'advanced',
      autoprefixer: false,
      'postcss-zindex': false
    },
  },
});
