module.exports = (api) => {
  api.cache(true);
  return {
    plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'],
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: 3,
          useBuiltIns: 'usage',
        },
      ],
      '@babel/preset-react',
      [
        '@babel/preset-typescript',
        {
          allowNamespaces: true,
        },
      ],
    ],
  };
};
