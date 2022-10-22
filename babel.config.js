module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./'],
        alias: {
          '^~(.+)': './src/\\1',
          tests: './__tests__',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
