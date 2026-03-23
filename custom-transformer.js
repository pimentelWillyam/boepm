const upstreamTransformer = require('metro-react-native-babel-transformer')

module.exports.transform = function ({ src, filename, options }) {
  // O plugin do Reanimated já está configurado no babel.config.js
  // Então apenas usamos o transformer padrão do Metro
  return upstreamTransformer.transform({ src, filename, options })
}
