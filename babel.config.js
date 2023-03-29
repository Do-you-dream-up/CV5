module.exports = (api) => {
  api.cache(true);

  const plugins = ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'];

  if (process.env.CI_BUILD_ID) {
    /** Add plugin packages for build process */
    plugins.push(['remove-object-properties', { regexp: 'data-test*' }])
  }

  return {
    plugins,
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: 3,
          useBuiltIns: 'usage',
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      [
        '@babel/preset-typescript',
        {
          allowNamespaces: true,
        },
      ],
    ],
  };
};
