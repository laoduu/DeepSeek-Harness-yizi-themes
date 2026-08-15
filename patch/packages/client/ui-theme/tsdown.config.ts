import { clientBundle } from '../tsdown.client.ts'

export default clientBundle(
  '@deepseek-ai/dsh-client-ui-theme',
  ['lib/types/index.js', 'lib/types/invariant.js'],
  {
    lib: {
      copy: [
        { from: 'src/styles/*', to: 'lib/styles' },
        // Theme sheets live under styles/themes/; keep the subdirectory so the
        // shell can @import each theme file by its stable lib path.
        { from: 'src/styles/themes/*', to: 'lib', flatten: false },
      ],
    },
  },
)
