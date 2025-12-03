const metroTransformer = require('metro-react-native-babel-transformer');
const reanimatedPlugin = require('react-native-reanimated/plugin');

module.exports = {
  transform: ({ src, filename, options }) => {
    // Primeiro aplica o transformer do Metro
    let result = metroTransformer.transform({
      src,
      filename,
      options
    });

    // Depois aplica o plugin do Reanimated (versão 2.9.1)
    if (reanimatedPlugin) {
      const babelParser = require('@babel/parser');
      const babelTraverse = require('@babel/traverse').default;
      const babelGenerate = require('@babel/generator').default;

      const ast = babelParser.parse(result.ast, {
        sourceType: 'module',
        plugins: ['jsx']
      });

      reanimatedPlugin(ast);

      result.code = babelGenerate(ast).code;
    }

    return result;
  }
};
