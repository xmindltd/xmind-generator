// This file provides configurations for "unbuild".

export default {
  entries: [
    // Build config for ESM modules.
    {
      // This builder preserves the folder structure rather than bundling all files up into one.
      builder: 'mkdist',
      input: './src/',
      outDir: './lib/esm/',
      format: 'esm',
      ext: 'js'
    },

    // Build config for CommonJS modules.
    {
      // This builder preserves the folder structure rather than bundling all files up into one.
      builder: 'mkdist',
      input: './src/',
      outDir: './lib/cjs/',
      format: 'cjs',
      ext: 'cjs'
    }
  ],

  // Include '.d.ts' type files.
  declaration: true
}
