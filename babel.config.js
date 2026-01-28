module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxRuntime: 'automatic' }]
    ],
    plugins: [
      // react-native-reanimated/plugin - 如果需要动画功能，先安装: npm install react-native-reanimated
      // 'react-native-reanimated/plugin'
    ]
  };
};
