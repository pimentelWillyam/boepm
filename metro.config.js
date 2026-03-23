const { getDefaultConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname)

// Filtrar SVG dos assets para permitir importação como componente
config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg',
)
config.resolver.sourceExts.push('svg')

// Configurações de transformação
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
}

module.exports = config
