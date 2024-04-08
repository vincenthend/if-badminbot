const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const alias = require('@rollup/plugin-alias')
const path = require('path')
const extensions = ['.ts', '.js']

const preventTreeShakingPlugin = () => {
  return {
    name: 'no-treeshaking',
    resolveId(id, importer) {
      if (!importer) {
        // let's not theeshake entry points, as we're not exporting anything in Apps Script files
        return { id, moduleSideEffects: 'no-treeshake' }
      }
      return null
    },
  }
}

const projectRootDir = path.resolve(__dirname)

module.exports = {
  input: './src/index.ts',
  output: {
    dir: 'build',
    format: 'esm',
  },
  plugins: [
    preventTreeShakingPlugin(),
    nodeResolve({
      extensions,
    }),
    babel({ extensions, babelHelpers: 'runtime' }),
    alias({
      entries: [{ find: 'src', replacement: path.resolve(projectRootDir, 'src') }],
    }),
  ],
}
