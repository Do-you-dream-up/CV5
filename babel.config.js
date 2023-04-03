module.exports = (api) => {
  api.cache(true);
  return {
    env: {
      production: {
        plugins: ['react-remove-properties', {"properties": ["data-testid"]}],
      },
    },
    plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'],
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
