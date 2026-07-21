module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ... otros plugins si tenés
      'react-native-reanimated/plugin', // 👈 SIEMPRE TIENE QUE IR AL FINAL
    ],
  };
};